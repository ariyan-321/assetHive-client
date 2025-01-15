import React, { useState, useEffect } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";

export default function Banner() {
  const images = [
    { 
      src: "/images/employee.png", 
      label: "Join as an Employee", 
      message: "Start your journey with us as an employee and explore growth opportunities.",
      link:"/join-as-an-employee"
    },
    { 
      src: "/images/hrManager.png", 
      label: "Join as an HR Manager", 
      message: "Lead and manage teams, optimize resources, and build a thriving work culture.",
      link:"/join-as-hr-manager"
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Automatically change the image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [currentImageIndex]);

  // Function to go to the next image
  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to go to the previous image
  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="w-[80%] rounded-xl mx-auto h-[400px] overflow-hidden relative">
      {/* Image Slider */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="relative w-full h-[500px] flex-shrink-0"
          >
            {/* Image */}
            <img
              src={image.src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>
            {/* Centered Button and Message */}
            {index === currentImageIndex && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                <h2 className="text-3xl font-semibold mb-4">{image.label}</h2>
                <p className="text-lg mb-6">{image.message}</p>
                <Link to={image.link} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105">
                  {image.label}
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center"
        onClick={handlePrev}
      >
        <AiOutlineLeft />
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center"
        onClick={handleNext}
      >
        <AiOutlineRight />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentImageIndex ? "bg-blue-500" : "bg-gray-300"}`}
          ></div>
        ))}
      </div>
    </div>
  );
}
