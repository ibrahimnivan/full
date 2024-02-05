"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

interface KartuProps {
  eventName: string;
  location: string;
  date: Date;
  price: number;
  category: string;
  image?: string;
  availableSeat: number;
  id: number;
  attendant: number;
  transaction: number;
  eventAttendantGoal: number;
}

const CardOrganizer: React.FC<KartuProps> = ({ id, eventName, location, availableSeat, attendant, date, price, category, image, transaction, eventAttendantGoal = 70 }) => {
  const eventDate = new Date(date);


  const [percentage, setPercentage] = useState(0);


  useEffect(() => {
    // Calculate the percentage of attendees
    const calculatedPercentage = (attendant / availableSeat) * 100;

    // Update the state to trigger a re-render
    setPercentage(calculatedPercentage);
  }, [transaction, attendant]);

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

  

  return (
    <div className="rounded bg-inherit p-3 m-4 hover:shadow-lg border-2">
      <Link href={`/event-detail/${id}`}>
        <div className="flex flex-row">
          <div className="w-[270px] ">
            <img src={`/postedimage/${image}`} alt={eventName} className="w-full h-52 object-cover rounded" />
            <div className=" w-full mt-3 ml-3">
              <p className="font-semibold text-lg ">{eventName}</p>
              <p className="font-medium">
                {formattedDate} • {formattedTime}
              </p>
              <p className="text-sm mt-1">{price === 0 ? "Free" : `${price} IDR`}</p>
              <p className="text-xs">Seat: {`${availableSeat}/${attendant}`}</p>
              
            </div>
            <div className="ml-1 mt-2 flex items-center">
              <MapPin className="h-3" />
              <p>{location}</p>
            </div>
          </div>

          <div className=" ml-3 mt-2 w-[200px]">
            <h2 className="font-semibold text-xl">Statistic :</h2>
            <div>
              <p>Transaction: {transaction.toLocaleString()} IDR</p>
                <p>Current attendees: {attendant}</p>
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

export default CardOrganizer;
