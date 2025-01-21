import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { authContext } from "../../Provider.jsx/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function CheckoutForm({ data, id, stateLocation }) {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const [clientSecret, setClientsecret] = useState("");
  const { user } = useContext(authContext);
  const [transactionId, setTransactionId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); // Loading state
  const navigate = useNavigate();

  const price = data === 5 ? 5 : data === 10 ? 8 : data === 20 ? 15 : 8;
  const selectedPackage =
    price === 5 ? 5 : price === 8 ? 10 : price === 15 ? 20 : null;

  useEffect(() => {
    axiosSecure.post("/create-payment-intent", { price }).then((res) => {
      setClientsecret(res.data.clientSecret);
    });
  }, [axiosSecure, price]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true); // Set loading state to true when payment starts

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const card = elements.getElement(CardElement);

    if (card === null) {
      setIsProcessing(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setIsProcessing(false);
      toast.error(error.message);
    } else {
      console.log("payment method", paymentMethod);
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user?.email || "anonymouse@gmail.com",
            name: user?.displayName || "anonymous",
          },
        },
      });

    if (confirmError) {
      setIsProcessing(false);
      console.log(confirmError.message);
    } else {
      if (paymentIntent.status === "succeeded") {
        toast.success(paymentIntent.status);
        setTransactionId(paymentIntent?.id);
        // Make a PATCH request to update the user's data with the new package and set hasPaid to true
        try {
          const response = await axiosSecure.patch(
            `/user-payment-success/${id}`,
            {
              selectedPackage, // Send the selected package to add to the user's package
            }
          );
          console.log(response.data);
          navigate(stateLocation||"/");
        } catch (err) {
          setIsProcessing(false);
          console.error("Error updating user data:", err);
          toast.error("Error updating user data");
        }
      }
    }
  };

  const cardStyle = {
    base: {
      color: "#32325d",
      fontFamily: "'Roboto', sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-lg max-w-md mx-auto mt-12"
    >
      <div className="mb-4">
        <CardElement
          options={{ style: cardStyle }}
          className="border px-4 py-3 rounded-lg shadow-sm"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 btn border-none text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        disabled={!stripe || !clientSecret || isProcessing} // Disable button while processing
      >
        {isProcessing ? "Processing..." : "Pay Now"} {/* Change button text */}
      </button>
      {transactionId && (
        <p className="font-semibold text-center my-5 ">
          Transaction Id: {transactionId}
        </p>
      )}
    </form>
  );
}
