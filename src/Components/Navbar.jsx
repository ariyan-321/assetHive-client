import React, { useContext, useEffect, useState } from "react";
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


  // State to manage dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Effect to load theme preference from localStorage on page load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.body.classList.remove("dark");
    }
  }, []);

  // Toggle dark mode using localStorage
  const toggleDarkMode = (event) => {
    const newDarkMode = event.target.checked;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

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
    <div className="bg-blue-400  sticky top-0  z-50" style={{ backgroundColor: "#60A5FA" }} >
      <div  className="navbar bg-blue-400  container mx-auto flex  justify-between items-center " style={{ backgroundColor: "#60A5FA" }} >
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
            <ul className="font-semibold menu menu-sm dropdown-content  rounded-box z-[1] mt-3 w-52 p-2 shadow">
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
              className="menu menu-sm dropdown-content  rounded-box z-[1] mt-4 w-52 p-2 shadow"
            >
              <li>
                <a>{user?.displayName}</a>
              </li>
              <li>
                <Link to={"/profile"} className="justify-between">Profile</Link>
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
        <label className="swap swap-rotate">
            {/* this hidden checkbox controls the state */}
            <input
              type="checkbox"
              className="theme-controller"
              value="synthwave"
              checked={isDarkMode}
              onChange={toggleDarkMode}
            />

            {/* sun icon */}
            <svg
              className="swap-off h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg
              className="swap-on h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
      </div>
    </div>
  );
}
