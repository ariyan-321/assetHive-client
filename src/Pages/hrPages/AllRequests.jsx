import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState, useEffect } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { authContext } from "../../Provider.jsx/AuthProvider";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

export default function AllRequests() {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(authContext);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  const {
    data: requests,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["requests", debouncedSearch],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/requests/all/${user?.email}?search=${debouncedSearch}`
      );
      return data;
    },
  });

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleApprove = async (id) => {
    try {
      const { data } = await axiosSecure.patch(`/requests/approve/${id}`);
      if (data.success) {
        toast.success("Request approved successfully!");
        refetch();
      }
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request.");
    }
  };

  const handleReject = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will reject the request!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axiosSecure.patch(`/requests/reject/${id}`);
          if (data.success) {
            toast.success("Request rejected successfully!");
            refetch();
          }
        } catch (error) {
          console.error("Error rejecting request:", error);
          toast.error("Failed to reject request.");
        }
      }
    });
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading requests...</p>;
  }

  if (isError) {
    return (
      <p className="text-center text-red-500">
        Error loading requests. Please try again.
      </p>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 via-white to-blue-100 min-h-screen">
     <Helmet>
        <title>AssetHive | AllRequests</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-center  mb-8">All Requests</h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by name or email..."
          className="w-full max-w-md px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Requests Grid */}
      {requests?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={request.asset.image}
                alt={request.asset.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {request.asset.name}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Asset Type:</span>{" "}
                  {request.asset.type}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Requester Name:</span>{" "}
                  {request?.name|| "N/A"}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Requester Email:</span>{" "}
                  {request.email}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Request Date:</span>{" "}
                  {new Date(request.requestDate).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Approval Date:</span>{" "}
                  {request.approvalDate
                    ? new Date(request.approvalDate).toLocaleDateString(
                        "en-GB",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "N/A"}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Message:</span>{" "}
                  {request.message ? (
                    request.message.length > 30 ? (
                      <span title={request.message}>
                        {request.message.slice(0, 30)}...
                      </span>
                    ) : (
                      request.message
                    )
                  ) : (
                    "N/A"
                  )}
                </p>

                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Status:</span> {request.status}
                </p>
                <div className="flex justify-between items-center">
                  <button
                    disabled={
                      request.status === "rejected" ||
                      request.status === "returned" ||
                      request.status === "approved"
                    }
                    className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                      request.status === "returned" ||
                      request.status === "rejected"
                        ? "bg-gray-500 text-white hover:bg-gray-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                    onClick={() => handleApprove(request._id)}
                  >
                    {request?.status === "approved" ? "Approved" : "Approve"}
                  </button>
                  <button
                    disabled={
                      request.status === "approved" ||
                      request.status === "returned" ||
                      request.status === "rejected"
                    }
                    className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                      request.status === "returned" ||
                      request.status === "approved" ||
                      request.status === "rejected"
                        ? "bg-gray-500 text-white hover:bg-gray-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                    onClick={() => handleReject(request._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">No requests found.</p>
      )}
    </div>
  );
}
