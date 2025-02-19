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
  if (isLoading) return <div className="flex justify-center items-center min-h-screen text-xl font-semibold">Loading...</div>;
  if (isError) return <div className="flex justify-center items-center min-h-screen text-xl font-semibold text-red-500">Failed to load the data</div>;

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold  mb-6 text-center">Top Most Requested Items</h1>
      
      {assets.length === 0 ? (
        <p className="text-center text-xl text-gray-500">No items found with requests greater than 2.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((item) => (
            <div
              key={item._id}
              className=" rounded-lg p-6 shadow-lg hover:shadow-xl transition duration-200 ease-in-out transform hover:scale-105"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-52 object-cover mb-4 rounded-md shadow-md"
              />
              <h2 className="text-xl font-semibold  mb-2">{item.name}</h2>
              <p className=" mb-1">Requests: <span className="font-bold ">{item.requests}</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
