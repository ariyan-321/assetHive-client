import React, { useContext } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { authContext } from "../../Provider.jsx/AuthProvider";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import toast from "react-hot-toast";

export default function RequestForAnAsset() {
  const axiosSecure = useAxiosSecure();
  const { user, logOut } = useContext(authContext);
  const axiosPublic = useAxiosPublic();

  // Fetch employee data
  const { data: employee } = useQuery({
    queryKey: ["users", logOut, user],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/users/${user?.email}`);
      return data;
    },
    enabled: !!user?.email,
  });

  // Fetch assets data
  const { data: assets, refetch } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/assets/${employee?.companyEmail}`);
      return data;
    },
    enabled: !!employee?.companyEmail,
  });

  // Handle request action
  const handleRequest = async (asset) => {
    const assetInfo = {
      email: user?.email,
      asset,
      status: "pending",
      requestDate: Date.now(), // Current date and time in milliseconds
      approvalDate:null,
    };
  
    try {
      // Step 1: Send request info to the backend
      const res = await axiosSecure.post(`/assets/request`, assetInfo);
  
      if (res.data.success) {
        // Step 2: Update the asset in the database
        const updateRes = await axiosSecure.patch(`/assets-update/${asset._id}`);
  
        if (updateRes.data.success) {
          toast.success("Request sent and asset updated successfully!");
          refetch(); // Refresh the assets list
        } else {
          toast.error("Failed to update asset.");
        }
      } else {
        toast.error("Failed to send request.");
      }
    } catch (error) {
      console.error("Error requesting asset:", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  
  
  
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Assets</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Image</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Availability</th>
              <th className="border border-gray-300 px-4 py-2">Requests</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {assets?.length > 0 ? (
              assets.map((asset, index) => (
                <tr key={asset._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <img
                      src={asset.image}
                      alt={asset.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{asset.name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{asset.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2">{asset.availability}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{asset.requests}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleRequest(asset)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Request
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No assets available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
