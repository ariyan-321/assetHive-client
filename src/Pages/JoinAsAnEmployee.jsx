import React, { useContext, useState } from "react";
import Lottie from "lottie-react";
import animationData from "../assets/lottie/employee-login.json";
import { FaGoogle } from "react-icons/fa";
import { authContext } from "../Provider.jsx/AuthProvider";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { imageUpload } from "../API/utils"; // Ensure this function is defined

export default function JoinAsAnEmployee() {
  const { createProfile, updateUserProfile, loading, googleLogin } = useContext(authContext);
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError("");

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.currentPassword.value;
    const dateOfBirth = e.target.date.value;

    if (!selectedImage) {
      toast.error("Please upload a profile image");
      return;
    }

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

    try {
      // Upload image and get the URL
      const photoURL = await imageUpload(selectedImage);

      const hrInfo = {
        name,
        email,
        password,
        dateOfBirth,
        image: photoURL,
        role: "employee",
      };

      await createProfile(email, password); // Creating profile
      await updateUserProfile({ displayName: name, photoURL }); // Updating profile
      toast.success("Successfully Registered");

      const response = await axiosPublic.post("/users", {hrInfo}); // Adjust API payload
      console.log(response.data);
      navigate("/"); // Navigate after successful registration
    } catch (err) {
      toast.error(err.message || "Registration failed");
      setFormError("Registration failed. Please try again.");
      console.error(err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const res = await googleLogin();
      const email = res.user?.email;
      const name = res.user?.displayName;

      if (email) {
        const hrInfo = {
          name,
          email,
          role: "employee",
        };

        const response = await axiosPublic.post("/users", {hrInfo});
        console.log(response.data);
        navigate("/");
        toast.success("Signup Successful");
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.message || "Google signup failed");
    }

    console.log(hrInfo)
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      toast.success("Image selected successfully");
    } else {
      toast.error("Failed to select image");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-white p-6">
      <div className="w-full lg:w-1/2 max-w-md bg-white text-gray-800 p-6 md:p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6">
          Join as an Employee
        </h1>

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
          <div>
            <label className="block text-sm font-medium mb-1">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleImageUpload}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-900 transition"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

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

      <div className="w-full lg:w-1/2 flex justify-center mb-8 lg:mb-0">
        <Lottie animationData={animationData} loop className="w-64 md:w-80 lg:w-96" />
      </div>
    </div>
  );
}
