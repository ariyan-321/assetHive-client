import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function IncreaseLimit() {
  const navigate=useNavigate();
  const packages = [
    { members: 5, price: 5 },
    { members: 10, price: 8 },
    { members: 20, price: 15 },
  ];

  const handleIncreaseLimit = (members, price) => {
    navigate("/payment", { state: { selectedPackage:members,location:"/add-an-employee" } })
   
  };

  return (
    <div className="min-h-screen text-center bg-gradient-to-b from-blue-100 via-white to-blue-50 flex flex-col items-center py-12">
      <h1 className="text-5xl font-extrabold mb-6 text-gray-800 animate-fadeIn">
        Increase Your Limit
      </h1>
      <p className="text-lg text-gray-600 mb-12 text-center max-w-xl">
        Unlock the full potential of your team by selecting a package that suits your needs.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        {packages.map((pkg, index) => (
          <div
            key={index}
            className="bg-white shadow-2xl rounded-lg p-8 hover:shadow-3xl transition-transform transform hover:-translate-y-2 duration-300"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-blue-600 mb-4">
                {pkg.members} Members
              </h2>
              <p className="text-gray-500 mb-4">
                Perfect for teams of up to {pkg.members} members.
              </p>
              <div className="text-4xl font-extrabold text-gray-800 mb-6">
                ${pkg.price}
              </div>
              <button
                onClick={() => handleIncreaseLimit(pkg.members, pkg.price)}
                className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
              >
                Increase Limit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
