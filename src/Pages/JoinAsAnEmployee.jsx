import React, { useContext, useState } from "react";
import Lottie from "lottie-react";
import animationData from "../assets/lottie/employee-login.json"; // Update this path accordingly
import { FaGoogle } from "react-icons/fa";
import { authContext } from "../Provider.jsx/AuthProvider";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import toast from "react-hot-toast"; // Add this import
import { useNavigate } from "react-router-dom";

export default function JoinAsAnEmployee() {
  const { createProfile, updateUserProfile, loading, googleLogin } = useContext(authContext);
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState(""); // New state to store error messages
  const axiosPublic = useAxiosPublic();

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError(""); // Clear previous form errors

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.currentPassword.value;
    const dateOfBirth = e.target.date.value;

    const passwordValidation = (password) => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
      return regex.test(password);
    };

    if (!passwordValidation(password)) {
      setPasswordError(
        "Password must contain at least one uppercase letter, one lowercase letter, and be at least 6 characters long."
      );
      return;
    }

    setPasswordError(""); // Clear previous errors

    const hrInfo = {
      name,
      email,
      password,
      dateOfBirth,
      role: "employee",
    };

    try {
      await createProfile(email, password); // Creating profile
      await updateUserProfile({ displayName: name }); // Updating profile
      toast.success("Successfully Registered");
      const response = await axiosPublic.post("/users", { hrInfo });
      console.log(response.data);
      navigate("/"); // Navigate after successful registration
    } catch (err) {
      toast.error(err.message); // Error handling
      setFormError("Registration failed. Please try again."); // Show registration error
      console.error(err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const res = await googleLogin(); // Use await directly for googleLogin
      const email = res.user?.email;
      const name = res.user?.displayName;

      if (email) {
        const hrInfo = {
          name,
          email,
          role:"employee"
        };

        const response = await axiosPublic.post("/users", { hrInfo });
        console.log(response.data);
        navigate("/"); // Navigate after successful Google login
        toast.success("Signup Successful");
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.message || "Google signup failed");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-white p-6">
      <div className="w-full lg:w-1/2 max-w-md bg-white text-gray-800 p-6 md:p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6">
          Join as an Employee
        </h1>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              name="name"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="currentPassword"
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            {passwordError && <p className="text-red-500 text-xs mt-2">{passwordError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              name="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-900 transition"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Google Login */}
        <div className="mt-6">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center bg-gray-100 text-red-800 font-medium py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-200 transition"
          >
            <FaGoogle className="mr-2" size={18} />
            Sign Up with Google
          </button>
        </div>
      </div>

      {/* Animation Section */}
      <div className="w-full lg:w-1/2 flex justify-center mb-8 lg:mb-0">
        <Lottie
          animationData={animationData}
          loop
          className="w-64 md:w-80 lg:w-96"
        />
      </div>
    </div>
  );
}
