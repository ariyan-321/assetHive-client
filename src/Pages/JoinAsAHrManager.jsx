import React, { useContext, useState } from "react";
import Lottie from "lottie-react";
import animationData from "../assets/lottie/hr-manager.json"; // Replace with the correct path
import { imageUpload } from "../API/utils";
import { authContext } from "../Provider.jsx/AuthProvider";
import toast from "react-hot-toast";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";

export default function JoinAsAHrManager() {
  const { createProfile, updateUserProfile } = useContext(authContext);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false); // Manage loading state
  const [formError, setFormError] = useState(""); // New state to store error messages
  const axiosPublic = useAxiosPublic();
  const navigate=useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Start spinner
    setFormError(""); // Clear previous form errors

    const name = e.target.name.value;
    const companyName = e.target.companyName.value;
    const image = e.target.image.files[0];
    const email = e.target.email.value;
    const password = e.target.currentPassword.value;
    const dateOfBirth = e.target.date.value;
    const selectedPackage = e.target.package.value;

    const passwordValidation = (password) => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
      return regex.test(password);
    };

    if (!passwordValidation(password)) {
      setPasswordError(
        "Password must contain at least one uppercase letter, one lowercase letter, and be at least 6 characters long."
      );
      setLoading(false); // Stop spinner
      return;
    }

    setPasswordError("");

    let photoURL;
    try {
      photoURL = await imageUpload(image);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Image upload failed.");
      setFormError("There was an issue uploading the image."); // Show image upload error
      setLoading(false); // Stop spinner
      return;
    }

    const hrInfo = {
      name,
      companyName,
      photoURL,
      email,
      dateOfBirth,
      selectedPackage:parseInt(selectedPackage),
      role: "hr-manager",
    };

    try {
      await createProfile(email, password); // Creating profile
      await updateUserProfile({ displayName: name, photoURL }); // Updating profile
      toast.success("Successfully Registered");
    const response = await axiosPublic.post("/users", {hrInfo} );
      console.log(response.data);
      navigate("/")

    } catch (err) {
      toast.error(err.message); // Error handling
      setFormError("Registration failed. Please try again."); // Show registration error
      console.error(err);
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full lg:w-1/2 max-w-md bg-white text-gray-800 p-6 md:p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-8">
          Join as an HR Manager
        </h1>
        {formError && (
          <div className="mb-4 p-4 bg-red-100 text-red-600 rounded-lg">
            <p>{formError}</p>
          </div>
        )}
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              name="name"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Company Name</label>
            <input
              name="companyName"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your company name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Company Logo</label>
            <input
              name="image"
              type="file"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept="image/*"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              name="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              name="currentPassword"
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date of Birth</label>
            <input
              name="date"
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Select a Package</label>
            <select
              name="package"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="5">5 Members for $5</option>
              <option value="10">10 Members for $8</option>
              <option value="20">20 Members for $15</option>
            </select>
          </div>
          <button
            type="submit"
            className={`w-full font-medium py-3 px-6 rounded-lg shadow-md transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
      <div className="w-full lg:w-1/2 mb-6 lg:mb-0 flex justify-center">
        <Lottie animationData={animationData} loop={true} className="w-72 md:w-96" />
      </div>
    </div>
  );
}
