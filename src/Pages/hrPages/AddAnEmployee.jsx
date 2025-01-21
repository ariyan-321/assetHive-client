import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../Components/SubComponents/LoagingSpinner";
import { authContext } from "../../Provider.jsx/AuthProvider";
import toast from "react-hot-toast";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function AddAnEmployee() {
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [selectedMembers, setSelectedMembers] = useState([]);

  const { user } = useContext(authContext); // Get logged-in user

  const navigate=useNavigate();

  const { data: company } = useQuery({
    queryKey: ["users", user],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/users/${user?.email}`);
      return data;
    },
    enabled: !!user?.email,
  });

  const { data: employees, refetch } = useQuery({
    queryKey: ["employees", user],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/employees/${user?.email}`);
      return data;
    },
    enabled: !!user?.email,
  });

  console.log("employees", employees);

  // Fetch users
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/users");
      return data;
    },
  });

  // Filter out the logged-in user and employees from the list of users
  // Filter users to exclude logged-in user, already added employees, and users affiliated with a company
  const filteredUsers = users?.filter(
    (u) =>
      u.email !== user?.email && // Exclude the logged-in user
      u.role === "employee" && // Include only users with role 'employee'
      !u.company && // Include only users not affiliated with any company
      !employees?.some((e) => e.user._id === u._id) // Exclude already added employees
  );

  // Handle checkbox changes
  const handleCheckboxChange = (userId) => {
    setSelectedMembers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId); // Remove if already selected
      } else {
        return [...prev, userId]; // Add if not selected
      }
    });
  };

  // Handle Add to Team for a single member
  const handleAddSingleMember = (user) => {
    if (employees.length + 1 > company?.selectedPackage) {
      toast.error("Your package limit is over. Upgrade your package to add more employees.");
      return;
    }
    const data = {
      user,
      company: company?.companyName,
      companyImage: company?.photoURL,
      companyEmail: company?.email,
    };
    -axiosSecure
      .post("/add-employee", [data])
      .then((res) => {
        if (res.data.insertedIds) {
          toast.success("Employee Added");

          // After successfully adding, update the user's data
          updateUserData(user._id);
        }
      })
      .catch((err) => {
        toast.error(err.message);
        console.log(err);
      });
  };

  // Handle Add to Team for selected members
  const handleAddSelectedMembers = () => {
    const teamMembers = filteredUsers?.filter((user) =>
      selectedMembers.includes(user._id)
    );
    if (teamMembers.length === 0) {
      toast.error("No members selected!");
      return;
    }
    if (employees.length + teamMembers.length > company?.selectedPackage) {
      toast.error("Your package limit is over. Upgrade your package to add more employees.");
      return;
    }

    // Prepare data to be sent
    const dataToSend = teamMembers.map((user) => ({
      user,
      company: company?.companyName,
      companyImage: company?.photoURL,
      companyEmail: company?.email,
    }));

    axiosSecure
      .post("/add-employee", dataToSend)
      .then((res) => {
        if (res.data.insertedIds) {
          toast.success("Employees Added");
         

          // After successfully adding, update the users' data
          teamMembers.forEach((member) => {
            updateUserData(member._id);
          });
        }
      })
      .catch((err) => {
        toast.error(`Error: ${err.message}`);
        console.log(err);
      });
  };

  const updateUserData = (userId) => {
    axiosSecure
      .patch(`/update-employee/${userId}`, {
        company: company?.companyName,
        companyImage: company?.photoURL,
        companyEmail: company?.email,
      })
      .then((updateRes) => {
        console.log("User updated successfully:", updateRes.data);
        toast.success("User Data Updated");
        navigate("/my-employee-list")
        refetch();
      })
      .catch((err) => {
        console.error("Error updating user data:", err);
        toast.error("Error updating user data");
      });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error loading users: {error.message}</div>;
  }

  return (
    <div className="container mx-auto my-8 px-4">
     <Helmet>
        <title>AssetHive | AddAnEmployee</title>
      </Helmet>
      <h1 className="text-3xl font-semibold text-center mb-8">
        Add an Employee
      </h1>

     <div className="flex justify-center items-center gap-5 flex-wrap">
     <h4 className="text-xl font-semibold text-center ">
        Employee Count:{employees.length}
      </h4>
      <h4 className="text-xl font-semibold text-center ">
        Package Limit:{company.selectedPackage}
      </h4>
     </div>
     <div className="flex justify-end items-center p-7">
      <Link to={"/increase-limit"} className="btn bg-green-500">Increase Limit</Link>
     </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full mx-auto shadow-lg rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-sm font-medium text-center">Select</th>
              <th className="p-4 text-sm font-medium text-center">Image</th>
              <th className="p-4 text-sm font-medium text-center">Name</th>
              <th className="p-4 text-sm font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers?.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(user._id)}
                    onChange={() => handleCheckboxChange(user._id)}
                    className="checkbox checkbox-primary"
                  />
                </td>
                <td className="p-4 text-center">
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-12 h-12 rounded-full mx-auto border-2 object-cover border-gray-300"
                  />
                </td>
                <td className="p-4 text-center font-medium">{user.name}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleAddSingleMember(user)}
                    disabled={!selectedMembers.includes(user._id)} // Disable button if not selected
                    className={`btn btn-primary btn-sm ${
                      !selectedMembers.includes(user._id)
                        ? "btn-disabled opacity-50"
                        : ""
                    }`}
                  >
                    Add to Team
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Selected Members Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleAddSelectedMembers}
          className="btn btn-success px-8 py-3 text-lg"
        >
          Add Selected to Team
        </button>
      </div>
    </div>
  );
}
