import "./app.css";
import Cards from "@/components/Cards";
import { NavBar } from "@/components/NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Carousel from "@/components/Carousel";

const Home = () => {
  return (
    <div className="w-full">
      <NavBar />
      <Carousel />
      <Cards />
      <ToastContainer />
    </div>
  );
};

export default Home;
