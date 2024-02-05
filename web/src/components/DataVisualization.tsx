import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

const token = sessionStorage.getItem("token");

export function DataVisualization() {
  const [eventNameList, setEventNameList] = useState<string[]>([]);
  const [eventTransactionList, setEventTransactionList] = useState<number[]>([]);

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

        const dataResponse: Event[] = data.data;

        const names = dataResponse.map((event) => event.eventName);
        setEventNameList(names)

        const transaction = dataResponse.map((event) => event.transaction)
        setEventTransactionList(transaction)
        

        console.log(
          dataResponse.map((event) => event.eventName),
          "kode 9"
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error or set an error state if needed
      }
    };

    fetchData();
  }, []);

  const labels = eventNameList


  const data = {
    labels,
    datasets: [
      {
        label: "Transaction",
        data: eventTransactionList,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
      },
    },
  };

  return <Bar options={options} data={data} />;
}
