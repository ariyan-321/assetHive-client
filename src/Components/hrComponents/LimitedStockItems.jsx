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
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load the data</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Limited Stock Items</h1>
      {assets.length === 0 ? (
        <p>No items with limited stock found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((item) => (
            <div
              key={item._id}
              className="border border-gray-200 rounded-lg p-4 shadow-md"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-32 object-cover mb-4 rounded"
              />
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
              <p className="text-gray-600">Availability: {item.availability}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
