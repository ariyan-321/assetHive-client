import React, { useContext, useState, useEffect } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { authContext } from "../../Provider.jsx/AuthProvider";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";

export default function RequestForAnAsset() {
  const axiosSecure = useAxiosSecure();
  const { user, logOut } = useContext(authContext);
  const axiosPublic = useAxiosPublic();

  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [modalMessage, setModalMessage] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Items per page

  // Debouncing the search input for smoothness
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300); // Adjust debounce time as needed
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch employee data
  const { data: employee, isLoading: employeeLoading } = useQuery({
    queryKey: ["users", logOut, user],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/users/${user?.email}`);
      return data;
    },
    enabled: !!user?.email,
  });

  // Fetch assets data
  const { data: assets, refetch, isLoading: assetsLoading } = useQuery({
    queryKey: ["assets", debouncedSearch, availabilityFilter, typeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (availabilityFilter) params.append("availability", availabilityFilter);
      if (typeFilter) params.append("type", typeFilter);

      const { data } = await axiosSecure.get(
        `/assets/${employee?.companyEmail}?${params.toString()}`
      );
      return data;
    },
    enabled: !!employee?.companyEmail,
  });

  // Handle pagination logic
  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil((assets?.length || 0) / itemsPerPage);
  const paginatedAssets = assets?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle request action
  const handleRequest = async () => {
    if (!modalMessage) {
      return toast.error("You have to leave a message");
    }

    const assetInfo = {
      name: user?.displayName,
      email: user?.email,
      asset: selectedAsset,
      status: "pending",
      requestDate: Date.now(),
      approvalDate: null,
      message: modalMessage,
    };

    try {
      const res = await axiosSecure.post(`/assets/request`, assetInfo);

      if (res.data.success) {
        const updatedAsset = {
          ...selectedAsset,
          quantity: selectedAsset.quantity - 1,
        };
        const updatedAvailability =
          updatedAsset.quantity > 0 ? "available" : "out-of-stock";

        const updateRes = await axiosSecure.patch(
          `/assets-update/${selectedAsset._id}`,
          {
            quantity: updatedAsset.quantity,
            availability: updatedAvailability,
            requests: selectedAsset.requests + 1,
          }
        );

        if (updateRes.data.success) {
          toast.success("Request sent and asset updated successfully!");
          refetch();
        } else {
          toast.error("Failed to update asset.");
        }
      } else {
        toast.error("Failed to send request.");
      }
    } catch (error) {
      console.error("Error requesting asset:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsModalOpen(false);
      setModalMessage("");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Helmet>
        <title>AssetHive | RequestForAnAsset</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Request for an Asset
      </h1>

      {/* Filter and Search Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search assets by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg shadow-sm w-full md:w-1/3"
        />
        <select
          value={availabilityFilter}
          onChange={(e) => {
            setAvailabilityFilter(e.target.value);
            refetch();
          }}
          className="p-2 border border-gray-300 rounded-lg shadow-sm w-full md:w-1/4"
        >
          <option value="">All Availability</option>
          <option value="available">Available</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            refetch();
          }}
          className="p-2 border border-gray-300 rounded-lg shadow-sm w-full md:w-1/4"
        >
          <option value="">All Types</option>
          <option value="Returnable">Returnable</option>
          <option value="Non-Returnable">Non-returnable</option>
        </select>
      </div>

      {/* Loading Spinner */}
      {(employeeLoading || assetsLoading) && (
        <div className="flex justify-center items-center h-64">
          <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}

      {/* Assets Table */}
      {!assetsLoading && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
            <thead>
              <tr className="bg-blue-100 text-blue-700">
                <th className="border border-gray-300 px-6 py-3 text-left">#</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Image</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Name</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Quantity</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Availability</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Type</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Requests</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAssets?.length > 0 ? (
                paginatedAssets.map((asset, index) => (
                  <tr
                    key={asset._id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="border border-gray-300 px-6 py-4 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-6 py-4 text-center">
                      <img
                        src={asset.image}
                        alt={asset.name}
                        className="h-16 w-16 object-cover rounded-lg shadow-md"
                      />
                    </td>
                    <td className="border border-gray-300 px-6 py-4">
                      {asset.name}
                    </td>
                    <td className="border border-gray-300 px-6 py-4 text-center">
                      {asset.quantity}
                    </td>
                    <td className="border border-gray-300 px-6 py-4">
                      {asset.availability}
                    </td>
                    <td className="border border-gray-300 px-6 py-4">
                      {asset.type}
                    </td>
                    <td className="border border-gray-300 px-6 py-4 text-center">
                      {asset.requests}
                    </td>
                    <td className="border border-gray-300 px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setIsModalOpen(true);
                          setSelectedAsset(asset);
                        }}
                        disabled={
                          !asset ||
                          asset.quantity <= 0 ||
                          asset.availability === "out-of-stock"
                        }
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        Request
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-4 text-lg text-gray-600"
                  >
                    No assets available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {/* Pagination Controls */}
<div className="flex justify-center mt-6 items-center">
  <button
    onClick={() => handlePagination(currentPage - 1)}
    disabled={currentPage === 1}
    className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2 hover:bg-blue-600"
  >
    Previous
  </button>
  <span className="px-4 py-2">
    Page {currentPage} of {totalPages}
  </span>
  <button
    onClick={() => handlePagination(currentPage + 1)}
    disabled={currentPage === totalPages}
    className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-2 hover:bg-blue-600"
  >
    Next
  </button>
</div>


      {/* Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">
              Request Asset: {selectedAsset?.name}
            </h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              placeholder="Enter your message"
              value={modalMessage}
              onChange={(e) => setModalMessage(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleRequest}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
