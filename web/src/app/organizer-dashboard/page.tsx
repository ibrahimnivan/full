"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Kartu from "@/components/Card";
import CardOrganizer from "@/components/CardOrganizer";
// import DataVisualization from '@/components/DataVisualization';
import { DataVisualization } from "@/components/DataVisualization";

interface UserData {
  user: string;
  role: string;
  pointsExpiration: string;
  points: number;
  discount: string | null;
}

interface Event {
  id: number;
  eventName: string;
  date: Date;
  location: string;
  price: number;
  description: string;
  availableSeat: number;
  organizerId: number;
  attendant: number;
  category: string;
  image?: string;
  transaction: number;
  eventAttendantGoal: number;
}

const OrganizerDashboard = () => {
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [transactionData, setTransactionData] = useState<number | null>(null);

  const token = sessionStorage.getItem("token");

  const userData: UserData | null = JSON.parse(sessionStorage.getItem("userData") || "null");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/event/organizer`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setEvents(data.data);

        const transactionData = data.transactionById;
        setTransactionData(transactionData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error or set an error state if needed
      }
    };

    fetchData();
  }, []);

  console.log(
    "ini eventName",
    events.map((event) => event.eventName)
  );

  const transaction = events.map((event) => event.transaction);
  const totalTransaction = transaction.reduce((acc, value) => acc + value, 0);

  return (
    <div>
      <div className="flex-col flex w-full justify-center mt-32">
        <div className="w-[60%]  mx-auto">
          {totalTransaction ? <DataVisualization /> : null }
          
        </div>
        <p className="text-center mr-5 text-xl font-semibold inline-block">Total Transaction: {totalTransaction.toLocaleString()} IDR </p>
      </div>

        {events.length === 0 ? <p className="py-5 mt-7 text-center font-semibold text-lg">You haven't created any events yet</p> :
         <h3 className="text-center mt-10">
        <span className="font-bold text-xl ">{userData?.user}</span> Event list
      </h3> 
      }
      
      <h4 onClick={() => router.push("/organizer-dashboard/create-event")} className="cursor-pointer bg-blue-500 hover:text-blue-700 px-4 py-2 rounded-md w-44 ml-16">
        {" "}
        Create New Event
      </h4>
      <div className="flex justify-center mx-auto w-[95%] flex-wrap ">{events && events.map((event, index) => <CardOrganizer key={index} {...event} />)}</div>
    </div>
  );
};

export default OrganizerDashboard;
