import React, { useContext } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { authContext } from '../../Provider.jsx/AuthProvider';

export default function TopMostRequestedItems() {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(authContext);

  // Fetching the most requested assets
  const { data: assets = [], isLoading, isError } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data } = await axiosSecure.get(`/asset/most/${user?.email}`);
      return data;
    },
    enabled: !!user?.email, // Ensure the query runs only if user email exists
  });

  // Loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load the data</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Top Most Requested Items</h1>
      {assets.length === 0 ? (
        <p>No items found with requests greater than 2.</p>
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
              <p className="text-gray-600">Requests: {item.requests}</p>
              <p className="text-gray-600">Availability: {item.availability}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
