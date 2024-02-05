import Prisma from "../../common/prisma";
import { Response, Request } from "express";
import { transporter } from "../../common/helpers/nodemailer.helper";
import { join } from "path";
import schedule from "node-schedule";
import { readFileSync } from "fs";
import Handlebars from "handlebars";
import moment from "moment-timezone";
import cron from "node-cron";

export interface PostEventPayload {
  eventName: string;
  date: Date;
  location: string;
  price: number;
  description: string;
  availableSeat: number;
  organizerId: number;
  category: string;
  image?: string;
}

export const postEvent = async (req: any, res: Response) => {
  try {
    // Extract event data from the request body
    const { eventName, price, date, location, description, availableSeat, category } = req.body;

    const { userId } = req; // from authorization middleware

    const parseId = parseInt(userId as string);
    const parseSeat = parseInt(availableSeat);
    const parsePrice = parseInt(price);

    const { file } = req;
    const imageFilename = file ? file.filename : null;

    // Validate required fields
    if (!eventName || !price || !date || !location || !description || !availableSeat || !userId || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create the event
    const [newEvent, createdEventOrganizers] = await Prisma.$transaction(async (prisma) => {
      const event = await prisma.event.create({
        data: {
          eventName,
          price: parsePrice,
          date: new Date(date),
          location,
          description,
          availableSeat: parseSeat,
          userId,
          category,
          organizerId: parseId,
          image: imageFilename,
        },
      });

      const eventOrganizer = await prisma.eventOrganizers.create({
        data: {
          eventId: event.id,
          organizerId: parseId,
        },
      });

      return [event, eventOrganizer];
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET ALL OR BY QUERY
export const getEvents = async (req: any, res: Response) => {
  try {
    const { location, category, search, page, limit = 5 } = req.query;

    const matchQuery = {
      location: location ? (location as string) : undefined,
      category: category ? (category as string) : undefined,
    };

    let skipped = 0;
    const parsedPage = parseInt(page as string);
    const parsedLimit = parseInt(limit as string);

    if (parsedPage && !isNaN(parsedPage)) {
      skipped = (parsedPage - 1) * parsedLimit;
    }

    const events = await Prisma.event.findMany({
      where: {
        ...matchQuery,
        OR: [
          {
            eventName: {
              contains: search,
            },
          },
          {
            description: {
              contains: search,
            },
          },
        ],
      },
      skip: skipped,
      take: page ? parsedLimit : undefined,
    });

    res.status(200).json({
      code: 200,
      message: "success",
      data: events,
      // transactionById: totalTransaction._sum.transaction
    });
  } catch (error) {
    console.log("Get All or by Querry Error", error);
    return res.status(500).json({
      code: 500,
      message: "Internal Server Error",
    });
  }
};

// GET DATA BY ID
export const getEventById = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    const parseId = parseInt(id);
    const parseUserId = parseInt(userId);

    const event = await Prisma.event.findFirst({
      where: {
        id: parseId,
      },
    });

    const user = await Prisma.user.findFirst({
      where: {
        id: parseUserId,
      },
    });

    res.status(200).json({
      code: 200,
      message: "success",
      data: event,
      userData: user,
    });
  } catch (error) {
    console.log("Get All or by Querry Error", error);
    return res.status(500).json({
      code: 500,
      message: "Internal Server Error",
    });
  }
};

// GET EVENT BY ORGANIZERid
export const getEventByOrganizer = async (req: any, res: Response) => {
  try {
    const { userId } = req;

    const parsedId = parseInt(userId);

    const forChart = await Prisma.eventOrganizers.findMany({
      where: {
        organizerId: parsedId,
      },
      include: {
        event: {
          include: {
            participants: {
              select: {
                transaction: true,
                transactionTime: true,
              },
            },
          },
        },
      },
    });

    const events = await Prisma.event.findMany({
      where: {
        organizerId: parsedId,
      },
    });

    res.status(200).json({
      code: 200,
      message: "success",
      data: events,
      dataa: forChart,
    });
  } catch (error) {
    console.log("Get All or by Querry Error", error);
    return res.status(500).json({
      code: 500,
      message: "Internal Server Error",
    });
  }
};

export const getUser = async (req: any, res: Response) => {
  try {
    const { userId } = req;

    const parsedUserId = parseInt(userId as string);

    const user = await Prisma.user.findFirst({
      where: {
        id: parsedUserId,
      },
    });

    res.status(200).json({
      code: 200,
      message: "success",
      data: user,
    });
  } catch (error) {
    console.log("Get All or by Querry Error", error);
    return res.status(500).json({
      code: 500,
      message: "Internal Server Error",
    });
  }
};

// transaction
export const transaction = async (req: any, res: Response) => {
  try {
    const { transaction, eventId, discount, points } = req.body;
    const { userId } = req;

    const parseTransaction = parseInt(transaction as string)

    const user = await Prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const event = await Prisma.event.findUnique({
      where: { id: eventId },
    });

    await Prisma.event.update({
      where: { id: eventId },
      data: {
        transaction: {increment: parseTransaction},
      }
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // await sendEmailLogic(userId, event, user.email, );

    if (discount) {
      await Prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          discount: false,
          discountExpiration: null,
        },
      });
    }

    if (points) {
      await Prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          points: 0,
          pointsExpiration: null,
        },
      });
    }

    // Add entry in EventParticipants
    const eventParticipant = await Prisma.eventParticipants.create({
      data: {
        eventId,
        userId,
        transaction: transaction,
      },
    });

    // Update attendant count in Event
    await Prisma.event.update({
      where: { id: eventId },
      data: {
        attendant: {
          increment: 1,
        },
      },
    });

    const templatePath = join(__dirname, "../../template", "template.hbs");
    const templateSource = readFileSync(templatePath, "utf-8");
    const compiledTemplate = Handlebars.compile(templateSource);
    const html = compiledTemplate({ eventName: event.eventName, userId, username: user.username, eventId: event.id });

    // `<p>halo</p>`
    // "2024-01-29 12:50"

    const eventDate = new Date(event.date);

    // Add 3 hours to eventDate
    eventDate.setHours(eventDate.getHours() + 3);

    console.log(eventDate, "ini setelah ditambah 3 jam");

    const targetDate = moment.tz(eventDate, "Asia/Jakarta");
    console.log(event.date, "ini event date");

    const cronExpression = `* * * * *`;

    console.log(cronExpression, "ini corn expression");

    // Schedule the job using node-cron
    const job = cron.schedule(cronExpression, async function () {
      await transporter.sendMail({
        from: "nathanrosxhild@gmail.com",
        to: user.email,
        subject: `Review and Rating for ${event.eventName} event`,
        html: html,
      });
      console.log("Method executed at bla bla bla", new Date());
    });

    // Start the cron job
    job.start();

    return res.status(200).json(eventParticipant);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const eventReview = async (req: any, res: Response) => {
  const { eventId, rating, reviewText, userId } = req.body;

  const parsedEventId = parseInt(eventId as string);
  const parsedUserId = parseInt(userId as string);

  const newReview = await Prisma.review.create({
    data: {
      eventId: parsedEventId,
      userId: parsedUserId,
      rating,
      reviewText,
    },
  });

  return res.status(201).json(newReview);
};

console.log(new Date(), "0 utc");


// export const totalTransactionOrganizer = async (req: any, res: Response) => {
//   const { userId } = req;

//   const parsedUserId = parseInt(userId as string);

//   const totalTransactions = await Promise.all(events.map(async (event) => {
//     const totalTransaction = await Prisma.eventParticipants
//       .groupBy({ eventId: event.id })
//       .sum({ transaction: true });

//     return {
//       eventId: event.id,
//       eventName: event.eventName,
//       totalTransaction: totalTransaction[0]?.sum?.transaction || 0,
//     };
//   }));

//   res.json(totalTransactions);
// };
