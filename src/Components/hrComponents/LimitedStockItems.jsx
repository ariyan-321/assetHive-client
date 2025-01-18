import React, { useContext } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { authContext } from '../../Provider.jsx/AuthProvider';
import { useQuery } from '@tanstack/react-query';

export default function LimitedStockItems() {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(authContext);

  // Fetch assets with limited stock
  const { data: assets = [], isLoading, isError } = useQuery({
    queryKey: ["limitedStock", user?.email], // Specific query key for limited stock
    queryFn: async () => {
      if (!user?.email) return [];
      const { data } = await axiosSecure.get(`/asset/limited/${user?.email}`);
      return data;
    },
    enabled: !!user?.email, // Ensure the query only runs when email is available
  });

  // Loading and error states
  if (isLoading) return <div className="flex justify-center items-center min-h-screen text-xl font-semibold">Loading...</div>;
  if (isError) return <div className="flex justify-center items-center min-h-screen text-xl font-semibold text-red-500">Failed to load the data</div>;

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold  mb-6 text-center">Limited Stock Items</h1>
      
      {assets.length === 0 ? (
        <p className="text-center text-xl text-gray-500">No items with limited stock found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((item) => (
            <div
              key={item._id}
              className="border border-gray-300 rounded-lg p-6 shadow-lg hover:shadow-xl transition duration-200 ease-in-out transform hover:scale-105"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover mb-4 rounded-md shadow-md"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h2>
              <p className="text-gray-600 mb-1">Quantity: <span className="font-bold text-gray-800">{item.quantity}</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
