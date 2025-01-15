import React, { useState } from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/lottie/add-asset.json";
import { imageUpload } from "../../API/utils";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";

export default function AddAnAsset() {
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [formError, setFormError] = useState(""); // Add formError state to handle errors
  const [loading, setLoading] = useState(false); // Add loading state to control the UI during async actions
  const axiosSecure=useAxiosSecure();

  const handleAdd = async () => {
    if (!productName || !productType || !productQuantity || !productImage) {
      toast.error("Please fill out all fields and upload an image!");
      return;
    }
  
    if (productQuantity <= 0) {
      toast.error("Quantity must be greater than zero");
      return;
    }
  
    setFormError(""); // Reset form error
    setLoading(true); // Start loading spinner
  
    let photoURL;
    try {
      photoURL = await imageUpload(productImage); // Await image upload
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Image upload failed.");
      setFormError("There was an issue uploading the image.");
      setLoading(false); // Stop spinner
      return;
    }
  
    const asset = {
      name: productName,
      type: productType,
      quantity: parseInt(productQuantity),
      image: photoURL,
    };
  
    try {
      const res = await axiosSecure.post("/assets", { asset });
      if (res.data.insertedId) {
        toast.success("Added Asset Successfully");
        // Reset form fields
        setProductName("");
        setProductType("");
        setProductQuantity("");
        setProductImage(null);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error adding asset:", error);
      toast.error("Failed to add the asset. Please try again.");
    } finally {
      setLoading(false); // Ensure loading is stopped
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 md:flex-row md:justify-around 2xl:justify-between">
      {/* Form Section */}
      <div className="w-full max-w-lg p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Add a New Asset
        </h1>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {/* Product Name */}
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter product name"
            />
          </div>

          {/* Product Type */}
          <div>
            <label
              htmlFor="productType"
              className="block text-sm font-medium text-gray-700"
            >
              Product Type
            </label>
            <input
              id="productType"
              type="text"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter product type"
            />
          </div>

          {/* Product Quantity */}
          <div>
            <label
              htmlFor="productQuantity"
              className="block text-sm font-medium text-gray-700"
            >
              Product Quantity
            </label>
            <input
              id="productQuantity"
              type="number"
              value={productQuantity}
              onChange={(e) => setProductQuantity(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter product quantity"
            />
          </div>

          {/* Product Image */}
          <div>
            <label
              htmlFor="productImage"
              className="block text-sm font-medium text-gray-700"
            >
              Product Image
            </label>
            <input
              id="productImage"
              type="file"
              accept="image/*"
              onChange={(e) => setProductImage(e.target.files[0])}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Add Button */}
          <button
            type="button"
            onClick={handleAdd}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Adding..." : "Add Asset"} {/* Show loading text */}
          </button>

          {/* Show form error if any */}
          {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
        </form>
      </div>

      {/* Lottie Animation Section */}
      <div className="hidden md:block w-full max-w-sm p-6">
        <Lottie
          animationData={animationData}
          loop={true}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
