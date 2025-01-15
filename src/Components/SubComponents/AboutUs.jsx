import React from "react";

export default function AboutUs() {
  return (
    <div className="w-[90%] md:w-[80%] mx-auto my-12 p-8 bg-white text-gray-800 rounded-lg shadow-lg">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-3">About AssetHive</h1>
        <p className="text-lg font-light text-gray-600">
          Simplifying asset management for modern businesses with innovative solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            At AssetHive, we are committed to transforming the way businesses manage their
            resources. Our goal is to provide a platform that enhances productivity,
            minimizes inefficiencies, and ensures smooth operations for all users.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Why Choose Us?</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2 text-blue-500">✔</span> Intuitive and user-friendly dashboard.
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-500">✔</span> Robust security for asset data.
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-500">✔</span> Real-time tracking and reporting.
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-500">✔</span> Perfect for small and mid-sized businesses.
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">Join the Hive Today!</h2>
        <p className="text-gray-700 mb-6">
          Take the next step in revolutionizing your asset management experience.
          Whether you're an HR manager or an employee, AssetHive has the tools you need.
        </p>
        <button className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
          Get Started Now
        </button>
      </div>
    </div>
  );
}
