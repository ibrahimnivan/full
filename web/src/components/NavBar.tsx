"use client";
import React, { useEffect, useState } from "react";
import { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CircleUser, LucideRemoveFormatting } from "lucide-react";


interface UserData {
  user: string;
  role: string;
  pointsExpiration: string;
  points: number;
  discount: boolean;
  discountExpiration: string;
}
export const NavBar = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [userDataState, setUserDataState] = useState<UserData>({} as UserData);


  const userData: UserData | null = JSON.parse(sessionStorage.getItem("userData") || "null");

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    // Check if there is a token in sessionStorage
    setHasToken(!!token); // Set hasToken to true if a token exists, false otherwise
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/event/user`, {
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
        setUserDataState(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error or set an error state if needed
      }
    };

    fetchData();
  }, []);
  const router = useRouter();

 

  const handleSignUpClick = () => {
    setShowTooltip(!showTooltip);
  };

  // For Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const modalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const pointsExpiration = userData?.pointsExpiration;

  const pointsDate = pointsExpiration ? new Date(pointsExpiration) : undefined;

  // Use nullish coalescing operator to provide a default date if pointsDate is undefined
  const formattedDatePoint = (pointsDate ?? new Date()).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const formattedTimePoint = (pointsDate ?? new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const discountExpiration = userDataState?.discountExpiration;
  const discountDate = new Date(discountExpiration) 

  // Use nullish coalescing operator to provide a default date if discountDate is undefined
  const formattedDateDiscount = (discountDate ?? new Date()).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const formattedTimeDiscount = (discountDate ?? new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const Modal: React.FC = () => {
    return (
      // Your modal content goes here
      <div className={`modal animate-slideIn py-7 pl-5 pr-7 absolute right-3 flex flex-col justify-between top-16 text-sm font-normal  bg-white text-black  shadow-lg`}>
        {userData?.role === "ORGANIZER" && <button className="hover:bg-orange-400 px-2 py-1" onClick={() => router.push("/organizer-dashboard")}>Organizer Dashboard</button>}
        {userData?.role === "CUSTOMER" && (
          <div>
            {userDataState?.points ? (
              <div className=" text-xs">
                <p className="font-semibold">Your Point : </p>
                <p className="mb-3 text-gray-700">{userData.points.toLocaleString()} IDR</p>
                <p className="font-semibold">Expire at :</p>
                <p className="mb-3">
                  {formattedDatePoint} - {formattedTimePoint}{" "}
                </p>
              </div>
            ) : (
              <p>You don't have any points <br /> at the moment.</p>
            )}

            <p className=" border-t mt-2 border-black"></p>

            {userDataState?.discount ? (
              <div className=" text-xs mt-2 ">
                <p className="font-semibold">Discout expiration :</p>
                <p className="mb-3 text-gray-700">
                  {formattedDateDiscount} - {formattedTimeDiscount}{" "}
                </p>
              </div>
            ) : (
              ""
            )}
          </div>
        )}
        <button className="mt-4 hover:text-orange-400" onClick={removeToken}>Logout</button>
      </div>
    );
  };

  const removeToken = () => {
    // Remove token from session storage
    sessionStorage.removeItem("token");
    // Close the modal after logout
    setIsModalOpen(false);
    setHasToken(false);
  };

  return (
    <div className="absolute z-50 flex cursor-pointer justify-between items-center w-full h-16 text-white xl:font-extrabold font-bold text-base xl:text-xl px-6">
      <div className="flex w-28 xl:w-52 space-x-4">
        <Image src="/logo/whitelogo.png" className="mt-2" alt="logo" width={200} height={200}></Image>
      </div>
      <div className="flex space-x-4 mr-5">
        {hasToken ? (
          // Render account logo or other authenticated user UI
          <div>
            <div className="flex mr-5 flex-col items-center justify-center hover:text-gray-400" onClick={modalToggle}>
              <CircleUser className="mb-1 mt-2" />
              <h3 className="text-sm">{userData?.user}</h3>
            </div>
          </div>
        ) : (
          // Render login and signup options
          <>
            <h3 className="hover:text-orange-400" onClick={() => router.push("/login")}>
              Log In
            </h3>
            <div className="relative" onClick={handleSignUpClick}>
              <h3 className="hover:text-orange-400">Sign Up</h3>
              {showTooltip && (
                <div className="absolute top-13 -left-3 text-xs bg-gray-700 inline-block p-2 rounded w-24 mt-2">
                  <p className="mb-2 hover:text-orange-400 " onClick={() => router.push("/register-organizer")}>
                    as Organizer
                  </p>
                  <p className="hover:text-orange-400" onClick={() => router.push("/register-customer")}>
                    as Customer
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {isModalOpen && <Modal />}
    </div>
  );
};
