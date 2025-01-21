import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useContext } from "react";
import CheckoutForm from "./CheckoutForm";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { authContext } from "../../Provider.jsx/AuthProvider";

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_GATEWAY_PK);

export default function Payment() {
  const { user } = useContext(authContext);
  const location = useLocation();
  const data = location.state?.selectedPackage;

  // Use TanStack Query (React Query) to fetch the HR Manager data
  const axiosPublic = useAxiosPublic();
  const { data: hrManager, isLoading, error } = useQuery({
    queryKey: ["hrManager", user?.email], // Dependency on email
    queryFn: async () => {
      if (user?.email) {
        const { data } = await axiosPublic.get(`/users/${user.email}`);
        return data;
      }
    },
    enabled: !!user?.email, // Only run query if user email exists
  });

  // Handling loading and error states
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        Error loading HR Manager data. Please try again later.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center  my-6">
        Pay Here to Manage Your Assets
      </h1>

      {/* Description section */}
      <div className="text-center text-gray-700 mb-8">
        <p className="text-lg">
          Securely process your payment to access all the amazing features of our asset management platform. 
          Make sure to review your package before proceeding.
        </p>
      </div>

      {/* Payment Form */}
      <div className="border-t pt-6 mt-6">
        <Elements stripe={stripePromise}>
          <CheckoutForm data={data} id={hrManager?._id}></CheckoutForm>
        </Elements>
      </div>
    </div>
  );
}
