import React from "react";
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
}

const Kartu: React.FC<KartuProps> = ({ id, eventName, location, availableSeat, attendant, date, price, category, image }) => {
  const eventDate = new Date(date);

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
    <div className="rounded w-[270px] bg-inherit m-4 hover:shadow-lg">
      <Link href={`/event-detail/${id}`}>
        <img src={`/postedimage/${image}`} alt={eventName} className="w-full h-52 object-cover rounded" />
        <div >
          <div className=" w-full mt-3 ml-3">
            <p className="font-semibold text-lg ">{eventName}</p>
            <p className="font-medium">
              {formattedDate} • {formattedTime}
            </p>
            <p className="text-sm mt-1">{price === 0 ? "Free" : `${price.toLocaleString()} IDR`}</p>
            <p className="text-xs">Seat: {`${availableSeat}/${attendant}`}</p>
          </div>
          <div className="ml-1 mt-2 flex items-center">
            <MapPin className="h-3" />
            <p>{location}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Kartu;
