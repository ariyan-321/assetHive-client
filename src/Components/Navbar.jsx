import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { authContext } from "../Provider.jsx/AuthProvider";
import { useQueries, useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";

export default function Navbar() {
  const { user, logOut } = useContext(authContext);

  const axiosPublic = useAxiosPublic();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users", logOut, user],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/users/${user?.email}`);
      console.log(data);
      return data;
    },
    enabled: !!user?.email,
  });

  const navInfo = (
    <>
      {!user && (
        <>
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/join-as-an-employee"}>Join as Employee</Link>
          </li>
          <li>
            <Link to={"/join-as-hr-manager"}>Join as HR Manager</Link>
          </li>
        </>
      )}

      {data?.role === "employee" && (
        <>
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/my-assets"}>My Assets</Link>
          </li>
          <li>
            <Link to={"/my-team"}>My Team</Link>
          </li>
          <li>
            <Link to={"/request-for-an-asset"}>Request for an Asset</Link>
          </li>
          <li>
            <Link to={"/profile"}>Profile</Link>
          </li>
        </>
      )}

      {data?.role === "hr-manager" && (
        <>
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/asset-list"}>Asset List</Link>
          </li>
          <li>
            <Link to={"/add-an-asset"}>Add an Asset</Link>
          </li>
          <li>
            <Link to={"/all-requests"}>All Requests</Link>
          </li>
          <li>
            <Link to={"/my-employee-list"}>My Employee List</Link>
          </li>
          <li>
            <Link to={"/add-an-employee"}>Add an Employee</Link>
          </li>
          <li>
            <Link to={"/profile"}>Profile</Link>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="bg-blue-400 sticky top-0  z-50">
      <div className="navbar  container mx-auto flex  justify-between items-center ">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul className="font-semibold menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              {navInfo}
            </ul>
          </div>
          <Link to={"/"} className="">
            <img
              className="w-[60px] h-[60px] object-cover rounded-lg"
              src={data?.companyImage || data?.photoURL || "/images/assetHive.png"}
              alt="Company Logo"
            />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="font-semibold menu menu-horizontal px-1">{navInfo}</ul>
        </div>
        <div className="flex gap-4 items-center">
          {!user && (
            <Link to={"/login"} className="btn btn-primary">
              Login
            </Link>
          )}{" "}
        </div>

        {user && (
          <div className="dropdown dropdown-end ">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component" src={user?.photoURL} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow"
            >
              <li>
                <a>{user?.displayName}</a>
              </li>
              <li>
                <a className="justify-between">Profile</a>
              </li>

              <li>
                <a
                  onClick={() => {
                    logOut();
                    console.log("LogOut");
                  }}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
