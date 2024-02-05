"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

interface CardProps {
  eventData: EventData;
}

interface EventData {
  eventId: number;
  organizerId: number;
  event: Event2;
}

interface Event2 {
  id: number;
  eventName: string;
  price: number;
  date: string;
  location: string;
  description: string;
  availableSeat: number;
  userId: number;
  image: string;
  organizerId: number;
  category: string;
  eventAttendatGoal: number;
  createdAt: string;
  attendant: number;
  participants: Participant[];
}

interface Participant {
  transaction: number;
  transactionTime: string;
}


const CardOrganizer2: React.FC<CardProps> = ({ eventData }) => {
  if (!eventData) {
    console.error("No eventData provided");
    return null; // or display an error message
  }
  const eventDate = new Date(eventData.event.date)

  const [percentage, setPercentage] = useState(0);


  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const totalTransaction = eventData.event.participants.reduce(
    (sum, participant) => sum + participant.transaction,
    0
  );

  

  return (
    <div className="rounded bg-inherit p-3 m-4 hover:shadow-lg">
      <Link href={`/event-detail/${eventData.event.id}`}>
        <div className="flex flex-row">
          <div className="w-[270px] ">
            <img src={`/postedimage/${eventData.event.image}`} alt={eventData.event.eventName} className="w-full h-52 object-cover rounded" />
            <div className=" w-full mt-3 ml-3">
              <p className="font-semibold text-lg ">{eventData.event.eventName}</p>
              <p className="font-medium">
                {formattedDate} • {formattedTime}
              </p>
              <p className="text-sm mt-1">{eventData.event.price === 0 ? "Free" : `${eventData.event.price} IDR`}</p>
              <p className="text-xs">Seat: {`${eventData.event.availableSeat}/${eventData.event.attendant}`}</p>
              
            </div>
            <div className="ml-1 mt-2 flex items-center">
              <MapPin className="h-3" />
              <p>{eventData.event.location}</p>
            </div>
          </div>

          <div className=" ml-3 mt-2 w-[200px]">
            <h2 className="font-semibold text-xl">Statistic :</h2>
            <div>
                <p>Transaction: {totalTransaction.toLocaleString()} IDR</p>
                <p>Current attendees: {eventData.event.attendant}</p>
                <p>Attendees progress: </p>

                <div className="w-full bg-slate-100 border-1 border rounded-5 overflow-hidden">
                  <div className="h-30 bg-yellow-400 text-black text-center" style={{ width: `${percentage}%`, lineHeight: "30px" }}>
                    {percentage.toFixed(2)}%
                  </div>
                </div>
                {/* <div className="w-full bg-red-600 border-[2px] border-solid border-ddd rounded-5 overflow-hidden">
                  <div className="h-30 bg-yellow-400 text-black text-center" style={{ width: `80%`, lineHeight: "30px" }}>
                    {percentage.toFixed(2)}%
                  </div>
                </div> */}
              </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardOrganizer2;
