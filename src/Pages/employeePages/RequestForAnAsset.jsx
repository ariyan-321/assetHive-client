import React, { useContext } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { authContext } from "../../Provider.jsx/AuthProvider";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

export default function RequestForAnAsset() {
  const axiosSecure = useAxiosSecure();
  const { user, logOut } = useContext(authContext);

  const axiosPublic = useAxiosPublic();

  const  {data:employee}  = useQuery({
    queryKey: ["users", logOut, user],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/users/${user?.email}`);
      console.log(data);
      return data;
    },
    enabled: !!user?.email,
  });

  const { data: assets, refetch } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/assets/${employee?.companyEmail}`);
      return data;
    },
  });


  console.log(assets)

  return <div>RequestForAnAsset</div>;
}
