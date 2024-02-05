"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  eventName: string;
  location: string;
  date: string;
  price: string;
  availableSeat: string;
  category: string;
  image: File | null;
  description: string;
}

const CreateEvent = () => {
  const [formData, setFormData] = useState<FormData>({
    eventName: "",
    location: "",
    date: "",
    price: "",
    availableSeat: "",
    category: "",
    image: null,
    description: "",
  });

  const router = useRouter();

  console.log(formData, "ini form data");

  // FORM METHOD
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setFormData({
      ...formData,
      image: file || null,
    });
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const cityOptions = ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar", "Palembang", "Tangerang", "Denpasar", "Balikpapan"];

  //   SEND DATA
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const backendUrl = "http://localhost:8000/api/event";

    try {
      const formDataToSend = new FormData(); // to send file and json

      // Append the JSON data
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "image" && value instanceof File) {
          formDataToSend.append("file", value);
        } else {
          formDataToSend.append(key, value);
        }
      });

      console.log("ini form data send", formDataToSend);

      const token = sessionStorage.getItem("token");

      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // You can handle success here, e.g., show a success message or redirect
      toast.success("Event Created Successully");

      setTimeout(() => {
        router.push("/organizer-dashboard");
      }, 2000);


      

      // Handle the response from the backend
    } catch (error) {
      // Handle any errors that occurred during the fetch
      console.error("Error sending data to backend:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-8 p-8 bg-white shadow-lg rounded-lg">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-center">CREATE EVENT</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="text-gray-700">Event Name:</label>
          </div>
          <div className="w-1/2">
            <input type="text" name="eventName" value={formData.eventName} onChange={handleChange} className="mt-1 w-full border-black border p-1" />
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="text-gray-700">Category:</label>
          </div>
          <div className="w-1/2">
            <select name="category" value={formData.category} onChange={handleSelectChange} className="mt-1 w-full border-black border p-1">
              <option value="no-category">Select a Category</option>
              <option value="Music">Music</option>
              <option value="Business">Business</option>
              <option value="Sports">Sports</option>
              <option value="Hobbies">Hobbies</option>
              <option value="Arts">Arts</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="text-gray-700">Date and Time:</label>
          </div>
          <div className="w-1/2">
            <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} className="mt-1 w-full border-black border p-1" />
          </div>
        </div>


        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="text-gray-700">Image Upload:</label>
          </div>
          <div className="w-1/2">
            <input type="file" accept="image/*" name="image" onChange={handleImageChange} className="mt-1 w-full " />
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="text-gray-700">Description:</label>
          </div>
          <div className="w-1/2">
            <textarea name="description" value={formData.description} onChange={handleChange} className="mt-1 w-full border-black border p-1" />
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="text-gray-700">Available Seats:</label>
          </div>
          <div className="w-1/2">
            <input type="number" name="availableSeat" value={formData.availableSeat} onChange={handleChange} className="mt-1 w-full border-black border p-1" />
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="text-gray-700">Price:</label>
          </div>
          <div className="w-1/2">
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 w-full border-black border p-1" />
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="text-gray-700">Location:</label>
          </div>
          <div className="w-1/2">
            <select name="location" value={formData.location} onChange={handleSelectChange} className="form-select mt-1 w-full border-black border p-1">
              <option value="">Select a City</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 mr-7 text-white rounded-full px-4 py-2  hover:bg-blue-600">
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
