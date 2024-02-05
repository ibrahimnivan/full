"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, SyntheticEvent, useState } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  username: string;
  email: string;
  referred: number | undefined;
  password: string;
  role: string;
}

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    referred: undefined,
    password: "",
    role: "CUSTOMER",
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
    const backendUrl = "http://localhost:8000/api/auth/register";

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

      if (response.status === 201) {
        toast.success("Account Created Successfully");
        toast.success("Refferal Code is Sent to Your Email");

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error(`HTTP error! Status: ${response.status}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // Handle the response from the backend
      console.log("Response from backend:", data);
    } catch (error) {
      // Handle any errors that occurred during the fetch
      console.error("Error sending data to backend:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <ToastContainer />
      <div className="bg-white flex flex-col justify-center p-8 rounded shadow-md w-96">
        <h1 className="text-center mb-5 text-lg font-semibold">REGISTER AS CUSTOMER</h1>

        <form onSubmit={handleSubmit}>
          <input type="hidden" name="role" value={formData.role} />
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} id="username" className="w-full p-2 border border-gray-300 rounded " />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} id="email" className="w-full p-2 border border-gray-300 rounded " />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} id="password" className="w-full p-2 border border-gray-300 rounded " />
          </div>

          <div className="mb-4">
            <label htmlFor="referral-code" className="block text-gray-700 text-sm font-bold mb-2">
              Referral code <span className="text-xs">(optional)</span>
            </label>
            <input type="text" name="referred" value={formData.referred} onChange={handleChange} id="referral-code" className="w-full p-2 border border-gray-300 rounded " />
          </div>
          <div>
            <button type="submit" className="mb-5 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Register
            </button>
          </div>

          <span>
            {" "}
            Already have an account?{" "}
            <Link className="text-center text-blue-500 hover:underline mt-2" href="/login">
              Login In
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;
