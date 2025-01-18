import React, { useContext } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { authContext } from '../../Provider.jsx/AuthProvider';
import { useQuery } from '@tanstack/react-query';

export default function PendingRequests() {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(authContext);

  // Fetch pending requests
  const { data: requests, isLoading, isError, error } = useQuery({
    queryKey: ['requests', user?.email], // Use user?.email for uniqueness
    queryFn: async () => {
      if (!user?.email) return []; // Prevent query from running if email is undefined
      const { data } = await axiosSecure.get(`/requests-pending/${user?.email}`);
      return data; // Return the data
    },
    enabled: !!user?.email, // Ensure the query only runs when email exists
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <div className="text-2xl font-semibold text-blue-500">Loading pending requests...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold text-red-500">Error loading requests: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold  text-center mb-6">Pending Requests</h1>
      
      {requests && requests.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md p-4">
          <ul className="space-y-4">
            {requests.map((request) => (
              <li
                key={request._id}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-blue-50 transition duration-200"
              >
                <div className="flex flex-col space-y-2">
                  <strong className="text-lg text-blue-700">{request.asset.name}</strong>
                  <div className="flex items-center space-x-2">
                    <img
                      src={request.asset.image}
                      alt={request.asset.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="text-sm text-gray-500">
                      <p><strong>Type:</strong> {request.asset.type}</p>
                      <p><strong>Quantity:</strong> {request.asset.quantity}</p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-sm">{request.status}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-400">{new Date(request.requestDate).toLocaleDateString()}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-center text-xl text-gray-500">No pending requests found.</p>
      )}
    </div>
  );
}
