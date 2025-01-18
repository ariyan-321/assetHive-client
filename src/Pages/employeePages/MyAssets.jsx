import React, { useContext } from "react";
import { authContext } from "../../Provider.jsx/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";

export default function MyAssets() {
  const { user } = useContext(authContext);
  const axiosSecure = useAxiosSecure();

  // Fetch requests data
  const { data: requests } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/employee/requests/${user?.email}`
      );
      return data;
    },
  });

  // Handle the return action for an asset
  const handleReturn = async (assetId) => {
    try {
      // Make a PATCH request to return the asset (update the status)
      const res = await axiosSecure.patch(`/assets-return/${assetId}`);
      if (res.data.success) {
        toast.success("Asset returned successfully!");
        // Optionally refetch requests or handle state update
      } else {
        toast.error("Failed to return asset.");
      }
    } catch (error) {
      console.error("Error returning asset:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Function to format date to "MM/DD/YYYY"
  const formatDate = (date) => {
    if (!date) return "N/A";
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg container mx-auto mt-6">
      <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">
        My Assets
      </h1>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm md:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Image</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Request Date</th>
              <th className="border border-gray-300 px-4 py-2">Approve Date</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests?.length > 0 ? (
              requests.map((request, index) => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <img
                      src={request.asset.image}
                      alt={request.asset.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.asset.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.asset.type}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {formatDate(request.requestDate)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {formatDate(request.approveDate)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleReturn(request.asset._id)}
                      className={`px-4 py-2 rounded transition ${
                        request.status === "approved" || request.asset.isNonReturnable
                          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                      disabled={request.status === "approved" || request.asset.type==="Non-Returnable"}
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No asset requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
