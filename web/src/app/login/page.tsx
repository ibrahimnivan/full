"use client";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
  email: string;
  password: string;
  username: string;
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    username: "",
  });
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Assuming you have a backend endpoint, replace 'YOUR_BACKEND_URL' with the actual URL
    const backendUrl = "http://localhost:8000/api/auth/login";

    try {
      // You can use fetch or any other HTTP library to send data to the backend
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        const data = await response.json();

        sessionStorage.setItem("token", data.data.token);

        const userData= data.data.userData

        sessionStorage.setItem("userData", JSON.stringify(userData));


        toast.success("You've successfully logged in. Welcome!")

        if(userData.role === 'CUSTOMER') {
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } 

        if(userData.role === 'ORGANIZER') {
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
       
      } else {
        toast.error(`HTTP error! Status: ${response.status}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Handle the response from the backend
    } catch (error) {
      // Handle any errors that occurred during the fetch
      console.error("Error sending data to backend:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <ToastContainer />
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input type="username" id="username" name="username" value={formData.username} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div>
            <button type="submit" className="mb-5 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Login
            </button>
          </div>
          <span>Don't have an account?</span>{" "}
          <Link href="/register" passHref>
            <span className="text-center text-blue-500 hover:underline mt-2">Register</span>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
