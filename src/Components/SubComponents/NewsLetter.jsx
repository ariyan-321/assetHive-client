import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { authContext } from "../../Provider.jsx/AuthProvider";

export default function NewsLetter() {
  const { user } = useContext(authContext);
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    const defaultMessage = "Thank you for subscribing to our newsletter!";
    const formData = {
      to: email,
      subject: "Newsletter Subscription",
      text: defaultMessage,
    };

    try {
      const res = await axios.post(
        "https://mainsender2.vercel.app/send-mail",
        formData
      );

      if (res.status === 200) {
        toast.success("Thanks for subscribing to our newsletter!");
        setEmail("");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="newsletter w-[90%] md:w-[80%] mx-auto mt-24 bg-gradient-to-r  bg-blue-400  text-white py-12  rounded-xl ">
      <h2 className="text-3xl text-center mb-6">Subscribe to our Newsletter</h2>
      <p className="text-center mb-8">
        Get the latest game reviews, updates, and more delivered to your inbox.
      </p>
      <div className="flex justify-center">
        <form
          onSubmit={handleNewsletterSubmit}
          className="flex gap-4 w-full max-w-md px-5"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="input input-bordered w-full px-4 py-2 text-black rounded"
            required
          />
          <button
            type="submit"
            className="btn btn-primary text-black px-6 py-2"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}
