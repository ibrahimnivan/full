import { number, object, string } from "yup";
import prisma from "../../common/prisma";
import { Request, Response } from "express";
import { hash, compare } from "../../common/helpers/bcrypt.helper";
import { generateToken } from "../../common/helpers/jwt.helper";
import { transporter } from "../../common/helpers/nodemailer.helper";

export interface RegisteredPayload {
  username: string;
  email: string;
  password: string;
  role: string;
  referral: number;
  pointsExpiration: Date;
  discount?: boolean;
  discountExpiration: Date | null;
}

const generateReferralCode = (): number => {
  const randomNumber = Math.floor(Math.random() * 1000000);
  const referral = randomNumber.toString().padStart(6, "0");
  const referralNum = parseInt(referral);
  return referralNum;
};

function addDays(originalDate: Date, daysToAdd: number): Date {
  const newDate = new Date(originalDate);
  newDate.setDate(originalDate.getDate() + daysToAdd);
  return newDate;
}

// REGISTER
export const register = async (req: Request, res: Response) => {
  const { username, email, role, password, referred } = req.body;

  const parseReferred = parseInt(referred);

  if (referred) {
    await prisma.user.update({
      where: { referral: parseReferred }, // Assuming referral is unique
      data: { points: { increment: 10000 } },
    });
  }

  const hashedPW = hash(password);
  const currentDate = new Date();
  const newDate = addDays(currentDate, 90);

  const createUserPayload: RegisteredPayload = {
    username,
    email,
    password: hashedPW,
    role: role,
    referral: generateReferralCode(),
    pointsExpiration: newDate,
    discount: referred ? true : false,
    discountExpiration: referred ? newDate : null,
  };

  const newUser = await prisma.user.create({
    data: createUserPayload,
  });

  await transporter.sendMail({
    from: 'nathanrosxhild@gmail.com',
    to: email,
    subject: 'welcome to Event Hub',
    html: `<h1>your referral code ${generateReferralCode()}</h1>`
  })

  return res.status(201).json({
    code: 201,
    message: "Email sent"
  });
};

// LOGIN
export const login = async (req: any, res: Response) => {
  const { username, email, password } = req.body;

  if ((!username && !email) || !password) {
    return res.status(400).json({
      code: 400,
      message: "Username or email and password cannot be empty",
    });
  }

  const condition: { username?: string; email?: string } = {};

  if (username) {
    condition.username = username;
  }

  if (email) {
    condition.email = email;
  }

  const user = await prisma.user.findFirst({
    // user otomatis ada tipenya dari prisma
    where: condition,
  });

  if (!user) {
    return res.status(404).json({
      code: 404,
      message: "User not found",
    });
  }

  const isValidUserPassword = compare(password, user.password);

  if (!isValidUserPassword) {
    return res.status(404).json({
      code: 404,
      message: "Invalid username or password",
    });
  }

  const generatedToken = generateToken(user);
  // Store the token in the request object for use in middleware

  // res.cookie('token', generatedToken, {
  //   httpOnly: true, // Hindari akses melalui JavaScript di sisi klien
  //   // secure: process.env.NODE_ENV === 'production', // Hanya terkirim di atas HTTPS di produksi
  //   sameSite: 'strict', // Memastikan cookie hanya dikirim dalam konteks yang sama (domain sama)
  //   maxAge: 5 * 60 * 1000, // 5 menit dalam milidetik
  //   path: '/', // Tentukan jalur tempat cookie dapat diakses
  // });

  return res.status(200).json({
    code: 200,
    message: "Success",
    data: {
      token: generatedToken,
      userData: {
        user: user.username,
        role: user.role,
        points: user.points,
        pointsExpiration: user.pointsExpiration,
        discount: user.discount,
        discountExpiration: user.discountExpiration
      },
    },
  });
};
