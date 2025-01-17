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
      const { data } = await axiosSecure.get(`requests/pending/${user?.email}`);
      return data; // Return the data
    },
    enabled: !!user?.email, // Ensure the query only runs when email exists
  });

  if (isLoading) {
    return <div>Loading pending requests...</div>;
  }

  if (isError) {
    return <div>Error loading requests: {error.message}</div>;
  }

  return (
    <div>
      <h1>Pending Requests</h1>
      {requests && requests.length > 0 ? (
        <ul>
          {requests.map((request) => (
            <li key={request._id}>
              <strong>{request.asset.name}</strong> - {request.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending requests found.</p>
      )}
    </div>
  );
}
