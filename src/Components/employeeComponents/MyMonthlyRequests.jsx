import React, { useContext } from 'react';
import { authContext } from '../../Provider.jsx/AuthProvider';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

export default function MyMonthlyRequests() {
  const { user } = useContext(authContext);
  const axiosSecure = useAxiosSecure();

  // Fetch monthly requests
  const { data: requests, isLoading, isError, error } = useQuery({
    queryKey: ["monthlyRequests", user?.email], // Use user?.email for uniqueness
    queryFn: async () => {
      if (!user?.email) return []; // Prevent query from running if email is undefined
      const { data } = await axiosSecure.get(
        `/employee/monthly/requests/${user?.email}`
      );
      return data;
    },
    enabled: !!user?.email, // Ensure the query only runs when email exists
  });

  // Render loading state
  if (isLoading) {
    return <div className="text-center text-xl text-gray-500">Loading...</div>;
  }

  // Render error state
  if (isError) {
    return <div className="text-center text-xl text-red-500">Error: {error.message || 'Something went wrong!'}</div>;
  }

  return (
    <div className="p-6  rounded-lg shadow-lg container mx-auto mt-6">
      <h1 className="text-3xl font-semibold text-center  mb-6">My Monthly Requests</h1>
      
      {requests?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table w-full table-striped table-zebra">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Asset Name</th>
                <th className="px-4 py-2 text-left">Request Date</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Asset Image</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={request._id} className=" transition-all">
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2">{request.asset.name}</td>
                  <td className="px-4 py-2">{new Date(request.requestDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{request.status}</td>
                  <td className="px-4 py-2">
                    <img
                      src={request.asset.image}
                      alt={request.asset.name}
                      className="w-12 h-12 object-cover rounded-lg mx-auto"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-lg text-gray-500">No requests found for this month.</p>
      )}
    </div>
  );
}
