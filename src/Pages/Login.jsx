import React, { useContext } from "react";
import Lottie from "lottie-react";
import animationData from "../assets/lottie/login-animation.json"; // Add your Lottie JSON animation file here
import { FaGoogle } from "react-icons/fa";
import { authContext } from "../Provider.jsx/AuthProvider";
import toast from "react-hot-toast";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../Components/SubComponents/LoagingSpinner";

export default function Login() {
  const { user, userLogin, loading, googleLogin } = useContext(authContext);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const location=useLocation();


  const redirectTo = location?.state?location?.state:"/";

  console.log(redirectTo)

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.currentPassword.value;
    console.log(email,password)
    userLogin(email, password)
      .then((res) => {
        toast.success("Login Success");
        navigate(location?.state ? location.state : "/");
      })
      .catch((err) => {
        console.log(err)
        toast.error(err.message || "Login Failed");
      });
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
          role: "employee",
        };

        const response = await axiosPublic.post("/users", { hrInfo });
        console.log(response.data);
        navigate(location?.state ? location.state : "/");        toast.success("Signup Successful");
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.message || "Google signup failed");
    }
  };

 

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-6">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 max-w-md bg-white text-gray-800 p-6 md:p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6 text-gray-700">
          Login to Your Account
        </h1>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="currentPassword"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Google Login */}
        <div className="mt-6">
          <p className="text-center text-sm text-gray-500 mb-4">
            Or login with
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center bg-red-500 text-white font-medium py-2 px-4 rounded-md hover:bg-red-600 transition w-full"
            >
              <FaGoogle className="mr-2" /> Login with Google
            </button>
          </div>
        </div>
      </div>

      {/* Animation Section */}
      <div className="w-full lg:w-1/2 flex justify-center mb-6 lg:mb-0">
        <Lottie
          animationData={animationData}
          loop={true}
          className="w-72 md:w-96"
        />
      </div>
    </div>
  );
}
