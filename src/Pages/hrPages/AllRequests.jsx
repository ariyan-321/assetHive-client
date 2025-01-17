import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { authContext } from '../../Provider.jsx/AuthProvider';

export default function AllRequests() {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(authContext);

  const { data: requests, isLoading, isError } = useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const { data } = await axiosSecure(`requests/all/${user?.email}`);
      return data; // Return the data
    },
  });

  if (isLoading) {
    return <p>Loading requests...</p>;
  }

  if (isError) {
    return <p>Error loading requests. Please try again.</p>;
  }

  console.log(requests);

  return (
    <div>
      <h1>All Requests</h1>
      {requests?.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Asset Name</th>
              <th className="border border-gray-300 px-4 py-2">Asset Type</th>
              <th className="border border-gray-300 px-4 py-2">Request Status</th>
              <th className="border border-gray-300 px-4 py-2">Request Date</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={request._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{request.asset.name}</td>
                <td className="border border-gray-300 px-4 py-2">{request.asset.type}</td>
                <td className="border border-gray-300 px-4 py-2">{request.status}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {request.requestDate
                    ? new Date(request.requestDate).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No requests found.</p>
      )}
    </div>
  );
}
