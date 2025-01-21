import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState, useEffect } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { authContext } from "../../Provider.jsx/AuthProvider";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function AssetList() {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(authContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce the search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: assets = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "assets",
      debouncedSearchTerm,
      filterStatus,
      filterType,
      sortOrder,
    ],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/asset-list/${user?.email}`, {
        params: {
          searchTerm: debouncedSearchTerm,
          filterStatus,
          filterType,
          sortOrder,
        },
      });
      return data;
    },
  });

  const handleDelete = (assetId) => {
    Swal.fire({
      title: "Delete Asset",
      text: "Are you sure you want to delete this asset?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/asset/${assetId}`)
          .then(() => {
            Swal.fire("Deleted!", "The asset has been deleted.", "success");
            refetch();
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              "Failed to delete the asset. Please try again later.",
              "error"
            );
          });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-16 h-16"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error loading assets, please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 sm:p-8 transition-all duration-300">
   <Helmet>
        <title>AssetHive | AssetList</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-center mb-6 ">Asset List</h1>

      {/* Search Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-center items-center">
        <input
          type="text"
          placeholder="Search by Name"
          className="p-3 border border-gray-300 rounded-md w-full md:w-1/3 transition-all duration-300 hover:border-blue-500 focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Section */}
      <div className="mb-6 flex flex-wrap gap-4 justify-center ">
        <select
          className="p-3 border border-gray-300 rounded-md transition-all duration-300 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          onChange={(e) => setFilterStatus(e.target.value)}
          value={filterStatus}
        >
          <option value="all">All Stock Status</option>
          <option value="available">Available</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>

        <select
          className="p-3 border border-gray-300 rounded-md transition-all duration-300 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          onChange={(e) => setFilterType(e.target.value)}
          value={filterType}
        >
          <option value="all">All Asset Types</option>
          <option value="Returnable">Returnable</option>
          <option value="Non-Returnable">Non-Returnable</option>
        </select>

        <select
          className="p-3 border border-gray-300 rounded-md transition-all duration-300 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          onChange={(e) => setSortOrder(e.target.value)}
          value={sortOrder}
        >
          <option value="asc">Sort by Quantity (Ascending)</option>
          <option value="desc">Sort by Quantity (Descending)</option>
        </select>
      </div>

      {/* Asset List */}
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white p-4">
        <table className="table-auto w-full text-sm md:text-base text-gray-700">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="py-3 px-6">#</th>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Date Added</th>
              <th className="py-3 px-6">Type</th>
              <th className="py-3 px-6">Quantity</th>
              <th className="py-3 px-6">Image</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.length > 0 ? (
              assets.map((asset, index) => (
                <tr
                  key={asset._id}
                  className="border-b hover:bg-gray-50 transition-all duration-300"
                >
                  <td className="py-3 px-6">{index + 1}</td>
                  <td className="py-3 px-6">{asset.name}</td>
                  <td className="py-3 px-6">
                    {asset.postDate
                      ? new Intl.DateTimeFormat("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }).format(new Date(Number(asset.postDate)))
                      : "Invalid Date"}
                  </td>
                  <td className="py-3 px-6">{asset.type}</td>
                  <td className="py-3 px-6">{asset.quantity}</td>
                  <td className="py-3 px-6">
                    <img
                      src={asset.image}
                      alt={asset.name}
                      className="w-16 h-16 object-cover rounded-lg transition-all duration-300 hover:scale-110"
                    />
                  </td>
                  <td className="py-3 px-6 flex space-x-2">
                    {/* Action Buttons */}
                    <Link
                      to={`/update/asset/${asset._id}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
                    >
                      Update
                    </Link>

                    <button
                      onClick={() => handleDelete(asset._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-600">
                  No assets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
