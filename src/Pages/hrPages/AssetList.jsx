import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { authContext } from "../../Provider.jsx/AuthProvider";

export default function AssetList() {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(authContext);

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/asset-list/${user?.email}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold text-center mb-6">Asset List</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>HR Email</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, index) => (
              <tr key={asset._id}>
                <th>{index + 1}</th>
                <td>{asset.name}</td>
                <td>{asset.HrEmail}</td>
                <td>{asset.type}</td>
                <td>{asset.quantity}</td>
                <td>
                  <img
                    src={asset.image}
                    alt={asset.name}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
