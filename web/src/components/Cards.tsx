"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Kartu from "./Card";
import debounce from "lodash/debounce";

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
}

interface FormData {
  category: string;
  location: string;
}

const cityOptions = ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar", "Palembang", "Tangerang", "Denpasar", "Balikpapan"];

const Cards: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const token = sessionStorage.getItem("token");

  const [formData, setFormData] = useState<FormData>({
    category: "",
    location: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const debouncedFetchData = debounce(async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/event?location=${encodeURIComponent(formData.location)}&category=${encodeURIComponent(formData.category)}&search=${searchTerm}`, {
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
      console.log("ini data cards", data);
      setEvents(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error or set an error state if needed
    }
  }, 1500);

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    debouncedFetchData();
  };

  useEffect(() => {
    // Fetch data immediately when the component mounts
    debouncedFetchData();

    // Cleanup function
    return () => {
      debouncedFetchData.cancel();
    };
  }, [formData, searchTerm]);

  const filteredEvents = events.filter((event) => event.availableSeat !== event.attendant);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = Math.ceil(filteredEvents.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pageNumbers));
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    buttons.push(
      <button key="previous" onClick={handlePreviousPage} className="pagination-button">
        Previous
      </button>
    );
    for (let i = 1; i <= pageNumbers; i++) {
      buttons.push(
        <button key={i} onClick={() => setCurrentPage(i)} className={currentPage === i ? "pagination-button active" : "pagination-button"}>
          {i}
        </button>
      );
    }
    buttons.push(
      <button key="next" onClick={handleNextPage} className="pagination-button">
        Next
      </button>
    );
    return buttons;
  };

  const renderEvents = () => {
    if (filteredEvents.length === 0) {
      return <div className="text-center text-gray-600 mt-4">No events match the search criteria.</div>;
    }

    return (
      <div>
        <div className="flex justify-center flex-wrap">
          {currentItems.map((event, index) => (
            <Kartu key={index} {...event} />
          ))}
        </div>

        <div className="pagination-buttons-container text-center pb-20">{renderPaginationButtons()}</div>
      </div>
    );
  };

  return (
    <div className="w-full bg-gray-200 pb-32">
      <div className=" py-8">
        <h2 className="text-center text-black font-semibold text-xl mb-3">Search Events</h2>
        <form className="flex flex-col xl:flex-row items-center justify-center ">
          <div className="flex flex-row mb-2">
            <div className="border border-black bg-white mr-2 p-[6px] ">
              <label className="mr-2">
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  <option value="">Select Category</option>
                  <option value="Music">Music</option>
                  <option value="Business">Business</option>
                  <option value="Sports">Sports</option>
                  <option value="Hobbies">Hobbies</option>
                  <option value="Arts">Arts</option>
                </select>
              </label>
            </div>

            <label className="mr-2">
              <select name="location" value={formData.location} onChange={handleInputChange} className="form-select mt-1 w-full border-black border p-2">
                <option value="">Select a City</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mr-2">
            <input type="text" value={searchTerm} onChange={handleSearchInputChange} placeholder="Search" className="border p-2 bg-gray-400 placeholder-black bg-opacity-40 rounded h-10" />
          </label>
        </form>
      </div>

      <div className="w-full ">
        <div className="flex justify-center w-[80%] border-t-2 border-gray-700 mt-2 pb-8 mx-auto"></div>
        {renderEvents()}
      </div>
    </div>
  );
};

export default Cards;
