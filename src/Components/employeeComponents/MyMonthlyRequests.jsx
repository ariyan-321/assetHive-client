import React, { useContext } from 'react';
import { authContext } from '../../Provider.jsx/AuthProvider';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

export default function MyMonthlyRequests() {
  const { user } = useContext(authContext);
  const axiosSecure = useAxiosSecure();

  // Fetch pending requests
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
    return <div>Loading...</div>;
  }

  // Render error state
  if (isError) {
    return <div>Error: {error.message || 'Something went wrong!'}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Monthly Requests</h1>
      {requests?.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Asset Name</th>
              <th className="border border-gray-300 px-4 py-2">Request Date</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={request._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{request.asset.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(request.requestDate).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No requests found for this month.</p>
      )}
    </div>
  );
}
