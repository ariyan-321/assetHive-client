import React from "react";

export default function Packages() {
  return (
    <div className="w-[90%] md:w-[80%] mx-auto my-12 p-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-3">Our Packages</h1>
        <p className="text-lg font-light text-gray-600">
          Choose the perfect plan for your business. We offer flexible pricing based on your team size.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Package 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-xl text-center transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-blue-50">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">Up to 5 Employees</h3>
          <p className="text-lg font-medium text-gray-700 mb-4">$5/month</p>
          <p className="text-sm text-gray-600 mb-6">
            Ideal for small businesses or startups with up to 5 employees.
          </p>
          <button className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
            Get Started
          </button>
        </div>

        {/* Package 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-xl text-center transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-blue-50">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">Up to 10 Employees</h3>
          <p className="text-lg font-medium text-gray-700 mb-4">$8/month</p>
          <p className="text-sm text-gray-600 mb-6">
            Perfect for growing teams with up to 10 employees.
          </p>
          <button className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
            Get Started
          </button>
        </div>

        {/* Package 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-xl text-center transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-blue-50">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">Up to 20 Employees</h3>
          <p className="text-lg font-medium text-gray-700 mb-4">$15/month</p>
          <p className="text-sm text-gray-600 mb-6">
            Best for mid-sized businesses with up to 20 employees.
          </p>
          <button className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
