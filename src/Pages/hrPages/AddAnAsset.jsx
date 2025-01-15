import React, { useState } from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/lottie/add-asset.json";

export default function AddAnAsset() {
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productImage, setProductImage] = useState(null);

  const handleAdd = () => {
    if (!productName || !productType || !productQuantity || !productImage) {
      alert("Please fill out all fields and upload an image!");
      return;
    }

    const asset = {
      name: productName,
      type: productType,
      quantity: productQuantity,
      image: productImage,
    };

    console.log("Asset added:", asset);
    alert("Asset added successfully!");

    setProductName("");
    setProductType("");
    setProductQuantity("");
    setProductImage(null);
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
          >
            Add Asset
          </button>
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
