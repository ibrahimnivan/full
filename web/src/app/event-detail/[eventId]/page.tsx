"use client";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface PageProps {
  params: {
    eventId: string;
  };
}

interface UserData {
  user: string;
  role: string;
  pointsExpiration: string;
  points: number;
  discount: boolean;
  discountExpiration: string;
}

interface Event {
  id: number;
  eventName: string;
  date: Date;
  location: string;
  attendant: number;
  price: number;
  description: string;
  availableSeat: number;
  organizerId: number;
  category: string;
  image?: string;
}

export default function Page({ params }: PageProps) {
  const [event, setEvent] = useState<Event>({} as Event);
  const [userDataState, setUserDataState] = useState<UserData | null>(null);

  const router = useRouter();


  const token = sessionStorage.getItem("token");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/event/${params.eventId}`, {
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
        setEvent(data.data);
        setUserDataState(data.userData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error or set an error state if needed
      }
    };

    fetchData();
  }, []);
  const eventDate = event?.date ? new Date(event.date) : undefined;

  const formattedDate = eventDate?.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const formattedTime = eventDate?.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const userData: UserData | null = JSON.parse(sessionStorage.getItem("userData") || "null");


  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const modalToggle = () => {
    if(!token){
      alert("you need to login for checkout")
    }
    setIsModalOpen(!isModalOpen);
  };

  // MODALL
  const Modal: React.FC = () => {
    const [useDiscount, setUseDiscount] = useState<boolean>(false);
    const [usePoints, setUsePoints] = useState<boolean>(false);


    const handleDiscountChange = () => {
      setUseDiscount(!useDiscount);
    };

    const handlePointsChange = () => {
      setUsePoints(!usePoints);
    };

    const calculateTotalPayment = () => {
      let totalPayment = event.price;

      if (useDiscount) {
        // Apply discount (10%)
        totalPayment -= event.price * 0.1;
      }

      if (usePoints && userDataState?.points) {
        // Subtract points from the total payment
        totalPayment -= userDataState.points;
      }

      return totalPayment;
    };

    const totalPayment = calculateTotalPayment();

    const performCheckout = async (totalPayment: number) => {
      const serverEndpoint = "http://localhost:8000/api/event/transaction";

      const response = await fetch(serverEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction: totalPayment,
          eventId: event.id,
          discount: useDiscount,
          points: usePoints,
        }),
      });

      if (response.status === 200) {
        toast.success("You've successfully got a ticket!");

        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        toast.error("You only can buy one ticket!");
      }

      console.log("response status", response.status);
    };

    const handleCheckout = async () => {
      try {
        const totalPayment = calculateTotalPayment();

        // Wait for the performCheckout to complete before proceeding
        const response = await performCheckout(totalPayment);

        // Handle success (e.g., show a success message)
        console.log("Checkout successful");
      } catch (error) {
        // Handle errors (e.g., show an error message)
        console.error("Error during checkout:", error);
      }
    };

    return (
      <div>
        <div className={`${isModalOpen ? "block" : "hidden"} fixed inset-0 bg-black opacity-65`} onClick={modalToggle}></div>
     
        <div
          className={`modal animate-slideIn py-5 px-3 absolute right-3 flex flex-col justify-between left-1/2 transform -translate-x-1/2 top-[40%] text-sm bg-white text-black shadow-lg`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent closing modal when clicking inside the modal
          }}
        >
             <ToastContainer />
          <form className="mt-4">
            <p className="font-semibold">Fee : {event.price.toLocaleString()} IDR</p>

            {userDataState?.discount ? (
              new Date(userDataState.discountExpiration) <= new Date() ? (
                <p>Discount is Expired</p>
              ) : (
                <div className="mt-4 flex justify-between px-3">
                  <label className="flex items-center">
                    <span className="mr-2">Use Discount</span>
                    <input type="checkbox" className="form-checkbox h-3 w-3 text-blue-500" checked={useDiscount} onChange={handleDiscountChange} />
                  </label>
                  <div>
                    <p>Discount is Available</p>
                  </div>
                </div>
              )
            ) : null}

            {userDataState?.points ? (
              new Date(userDataState.pointsExpiration) <= new Date() ? (
                <p>Points is expired</p>
              ) : (
                <div className="mt-4 flex justify-between px-3">
                  <label className="flex items-center">
                    <span className="mr-2">Use Points</span>
                    <input type="checkbox" className="form-checkbox h-3 w-3 text-blue-500" checked={usePoints} onChange={handlePointsChange} />
                  </label>
                  <div>{userDataState.points.toLocaleString()} IDR</div>
                </div>
              )
            ) : null}

            <label className="block text-sm font-semibold mt-2 mb-2">Total Payment : {calculateTotalPayment()} IDR</label>

            <div className="mt-4 flex justify-end mr-7">
              <button onClick={handleCheckout} type="submit" className="px-3 py-2  bg-red-500 mr-0">
                Checkout
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col xl:flex-row mt-20">
        <img src={`/postedimage/${event?.image}`} alt={event?.eventName} className="ml-7 xl:w-[55vw] w-[70vw] h-[auto] object-cover rounded" />

        {isModalOpen && <Modal />}

        <div className="ml-8 mr-5">
          <p className="xl:text-4xl text-xl font-bold mt-8">{event?.eventName}</p>

          <div className="mt-3">
            <h2 className="font-semibold">Date and Time</h2>
            <p>
              {formattedDate} - {formattedTime}
            </p>
          </div>

          <div className="mt-3">
            <p className="bg-gray-400 px-4 py-1 inline-block">Fee : {event?.price === 0 ? "Free" : event.price + " IDR"}</p>
          </div>

          <div className="mt-3">
            <p className="font-semibold">Description :</p>
            <p>{event?.description} Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>

          <div className="mt-3">
            <p>
              {" "}
              <span className="font-semibold">Available Seat</span> - {`${event.availableSeat}/${event.attendant}`}
            </p>
          </div>

          <div>
            <div className="flex mt-5 items-center">
              <MapPin className="h-4" />
              <p className="ml-2 font-semibold">{event?.location}</p>
            </div>

            <div className="mt-5 flex flex-row">
              <p className="font-semibold mr-2">Category : </p>
              <p>{event?.category}</p>
            </div>
          </div>

          <div className="mt-5 flex justify-center">
            {event.price ? (
              <button onClick={modalToggle} className="px-3 py-2 bg-red-500">
                Checkout
              </button>
            ) : (
              <button className="px-3 py-2 bg-orange-500">Reserve a Spot</button>
            )}
          </div>
        </div>
      </div>

      <div className="h-32 w-full "></div>
    </div>
  );
}
