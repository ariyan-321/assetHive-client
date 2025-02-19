import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { authContext } from '../../Provider.jsx/AuthProvider';

export default function MyPendingRequests() {
  const { user } = useContext(authContext);
  const axiosSecure = useAxiosSecure();

  // Fetch pending requests
  const { data: requests, isLoading, isError, error } = useQuery({
    queryKey: ["pendingRequests", user?.email], // Use user?.email for uniqueness
    queryFn: async () => {
      if (!user?.email) return []; // Prevent query from running if email is undefined
      const { data } = await axiosSecure.get(
        `/employee/requests/pending/${user?.email}`
      );
      return data;
    },
    enabled: !!user?.email, // Ensure the query only runs when email exists
  });

  return (
    <div className="p-6 bg-white text-black rounded-lg shadow-md container mx-auto mt-6">
      <h1 className="text-3xl font-semibold text-center  mb-6">
        My Pending Requests
      </h1>

      {isLoading && <p className="text-center text-lg">Loading...</p>}

      {isError && (
        <p className="text-center text-lg text-red-500">
          Error: {error.message}
        </p>
      )}

      {!isLoading && requests?.length === 0 && (
        <p className="text-center text-lg text-gray-500">No pending requests found.</p>
      )}

      {!isLoading && requests?.length > 0 && (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li
              key={request._id}
              className="p-4 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center space-x-4">
                {/* Asset Image */}
                <img
                  src={request.asset.image}
                  alt={request.asset.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-medium">{request.asset.name}</p>
                    <span
                      className={`px-3 py-1 text-white text-sm rounded-full ${
                        request.status === 'Pending'
                          ? 'bg-yellow-500'
                          : request.status === 'Approved'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">Status: {request.status}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
