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

  // Debugging console logs
  console.log({ requests, isLoading, isError, error });

  return (
    <div>
      <h1 className="text-2xl font-bold">Pending Requests</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {error.message}</p>}
      {!isLoading && requests?.length === 0 && <p>No pending requests found.</p>}
      {!isLoading && requests?.length > 0 && (
        <ul>
          {requests.map((request) => (
            <li key={request._id}>
              <p>Name: {request.asset.name}</p>
              <p>Status: {request.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
