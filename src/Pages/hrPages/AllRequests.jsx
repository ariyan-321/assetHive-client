import { useQuery } from '@tanstack/react-query';
import React, { useContext, useState, useEffect } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { authContext } from '../../Provider.jsx/AuthProvider';

export default function AllRequests() {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(authContext);
  const [search, setSearch] = useState(''); // State for search input
  const [debouncedSearch, setDebouncedSearch] = useState(''); // Debounced search state

  // Debounce logic: Update `debouncedSearch` after 300ms of inactivity
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300); // 300ms debounce time

    return () => clearTimeout(handler); // Cleanup on unmount or change
  }, [search]);

  const { data: requests, isLoading, isError, refetch } = useQuery({
    queryKey: ['requests', debouncedSearch], // Include debounced search term in query key
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/requests/all/${user?.email}?search=${debouncedSearch}`
      );
      return data;
    },
  });

  const handleSearchChange = (e) => {
    setSearch(e.target.value); // Update raw search term
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading requests...</p>;
  }

  if (isError) {
    return <p className="text-center text-red-500">Error loading requests. Please try again.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">All Requests</h1>
      {/* Search Bar */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by name or email..."
          className="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* Requests Grid */}
      {requests?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <img
                src={request.asset.image}
                alt={request.asset.name}
                className="w-full h-40 object-cover rounded-t-lg mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{request.asset.name}</h2>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Asset Type:</span> {request.asset.type}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">HR Email:</span> {request.asset.HrEmail}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Requester Email:</span> {request.email}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Request Date:</span>{' '}
                {new Date(request.requestDate).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Status:</span> {request.status}
              </p>
              <div className="flex justify-between items-center">
                <button
                  className="bg-green-500 text-white text-sm px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                  onClick={() => handleApprove(request._id)}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500 text-white text-sm px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                  onClick={() => handleReject(request._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No requests found.</p>
      )}
    </div>
  );

  // Approve Request
  const handleApprove = async (id) => {
    try {
      const { data } = await axiosSecure.patch(`/requests/approve/${id}`);
      if (data.success) {
        alert('Request approved successfully!');
        refetch();
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request.');
    }
  };

  // Reject Request
  const handleReject = async (id) => {
    try {
      const { data } = await axiosSecure.patch(`/requests/reject/${id}`);
      if (data.success) {
        alert('Request rejected successfully!');
        refetch();
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request.');
    }
  };
}
