import React, { useContext } from "react";
import Banner from "./SubComponents/Banner";
import AboutUs from "./SubComponents/AboutUs";
import Packages from "./SubComponents/Packages";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import { authContext } from "../Provider.jsx/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import MyPendingRequests from "./employeeComponents/MyPendingRequests";
import MyMonthlyRequests from "./employeeComponents/MyMonthlyRequests";
import Notice from "./employeeComponents/Notice";
import Events from "./employeeComponents/Events";
import PendingRequests from "./hrComponents/PendingRequests";
import TopMostRequestedItems from "./hrComponents/TopMostRequestedItems";
import LimitedStockItems from "./hrComponents/LimitedStockItems";
import PieChart from "./hrComponents/PieChart";
import HrEvents from "./hrComponents/hrEvents";
import Calander from "./hrComponents/Calander";

export default function Home() {
  const { user } = useContext(authContext);

  const axiosPublic = useAxiosPublic();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users", user],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/users/${user?.email}`);
      console.log(data);
      return data;
    },
    enabled: !!user?.email,
  });

  return (
    <div className="container mx-auto">
      {!user && (
        <>
          <div className="my-12">
            <Banner></Banner>
          </div>

          <div className="my-20">
            <AboutUs></AboutUs>
          </div>

          <div className="my-20">
            <Packages></Packages>
          </div>
        </>
      )}

      {
        data?.role==="employee" &&
        <>
          <div className="my-12">
            <MyPendingRequests></MyPendingRequests>
          </div>

          <div className="my-20">
            <MyMonthlyRequests></MyMonthlyRequests>
          </div>

          <div className="my-20">
            <Notice></Notice>
          </div>
          <div className="my-20">
            <Events></Events>
          </div>
        </>
      }


{
        data?.role==="hr-manager" &&
        <>
          <div className="my-12">
            <PendingRequests></PendingRequests>
          </div>

          <div className="my-20">
            <TopMostRequestedItems></TopMostRequestedItems>
          </div>

          <div className="my-20">
            <LimitedStockItems></LimitedStockItems>
          </div>
          <div className="my-20">
            <PieChart></PieChart>
          </div>

          <div className="my-20">
            <HrEvents></HrEvents>
          </div>
          <div className="my-20">
            <Calander></Calander>
          </div>
        </>
      }


    </div>
  );
}
