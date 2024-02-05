"use client";
import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Image from "next/image";
import CategoryIcon from "./CategoryIcon";

export default class MultipleItems extends Component {
  render() {
    const settings = {
      infinite: true,
      slidesToShow: 1,
      accessibility: false,
      arrows: false,
      slidesToScroll: 1,
      autoplay: true,
      speed: 2000,
      pauseOnHover: false,
      autoplaySpeed: 7000,
      cssEase: "linear",
    };
    return (
      <div className="relative">
        <div className="relative">
          <div className="w-full">
          <Slider {...settings}>
            <div className="w-[w-full] xl:h-[75vh] h-[40vh] filter-image">
              {/* <Image src="/bg-slider/bg-1.jpg" width={500} height={300} alt="brabus 600" /> */}
              <img src="/carousel/bg-1.jpg" alt="" />
            </div>

            <div className="w-[w-full] h-[75vh] filter-image">
              {/* <Image src="/carousel/bg-3.jpg" width={500} height={300} alt="brabus 900" /> */}
              <img src="/carousel/bg-3.jpg" alt="" />
            </div>

            <div className="w-[w-full] h-[75vh] filter-image">
              {/* <Image src="/carousel/bg-4.jpg" width={500} height={300} alt="brabus 900 superblack" /> */}
              <img src="/carousel/bg-2.jpg" alt="" />
            </div>

            <div className="w-[w-full] h-[75vh] filter-image">
              {/* <Image src="/carousel/bg-4.jpg" width={500} height={300} alt="brabus 900 superblack" /> */}
              <img src="/carousel/bg-4.jpg" alt="" />
            </div>

          </Slider>
          </div>
          
          <div className="absolute top-[55%] left-1/2 transform -translate-x-1/2 flex">
          <h1 className="text-white text-2xl text-center font-bold"> YOUR GATEWAY TO DISCOVER AND CREATE EXTRAORDINARY EXPERIENCES</h1>
          </div>
          <div className="absolute xl:top-[60%] top-[30%] w-[70%] left-1/2 transform -translate-x-1/2 flex">
            <CategoryIcon />
          </div>
        </div>
      </div>
    );
  }
}
