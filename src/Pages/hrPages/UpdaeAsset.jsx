import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { authContext } from '../../Provider.jsx/AuthProvider';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { imageUpload } from '../../API/utils';

export default function UpdateAsset() {
  const { id } = useParams(); // Get the asset ID from the URL
  const axiosSecure = useAxiosSecure();
  const navigate=useNavigate();

  const { data: asset, isLoading } = useQuery({
    queryKey: ['asset', id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/asset-details/${id}`);
      return data;
    },
  });

  console.log(asset);

  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productImage, setProductImage] = useState(asset?.image || null); // Set default value from asset data
  const [loading, setLoading] = useState(false);
  const { user } = useContext(authContext);

  // Set default values once asset data is fetched
  useEffect(() => {
    if (asset) {
      setProductName(asset.name);
      setProductType(asset.type);
      setProductQuantity(asset.quantity);
      setProductImage(asset.image); // Set initial product image
    }
  }, [asset]);

  const handleUpdate = async () => {
    if (!productName || !productType || !productQuantity || !productImage) {
      toast.error('Please fill out all fields and upload an image!');
      return;
    }

    if (productQuantity <= 0) {
      toast.error('Quantity must be greater than zero');
      return;
    }

    const data = {
      name: productName,
      type: productType,
      quantity: productQuantity,
      image: productImage, // The uploaded image URL or path
    };

    setLoading(true);

    try {
      // Assuming you're sending the data to the backend to update the asset
      const response = await axiosSecure.put(`/update-asset/${id}`, data);
      toast.success('Asset updated successfully');
      navigate('/asset-list')
    } catch (error) {
      console.error('Error updating asset:', error);
      toast.error('Failed to update the asset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Conditionally render form when asset data is available
  if (isLoading) {
    return <div>Loading...</div>; // Show loading state until data is fetched
  }

  if (!asset) {
    return <div>Asset not found</div>; // Handle case when asset is not found
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 md:flex-row md:justify-around 2xl:justify-between">
      {/* Form Section */}
      <div className="w-full max-w-lg p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Asset</h1>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
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

          {/* Product Type Dropdown */}
          <div>
            <label htmlFor="productType" className="block text-sm font-medium text-gray-700">
              Product Type
            </label>
            <select
              id="productType"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select type</option>
              <option value="Returnable">Returnable</option>
              <option value="Non-Returnable">Non-Returnable</option>
            </select>
          </div>

          {/* Product Quantity */}
          <div>
            <label htmlFor="productQuantity" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="productImage" className="block text-sm font-medium text-gray-700">
              Product Image
            </label>
            <input
              id="productImage"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const image = await imageUpload(e.target.files[0]); // Upload image and get the URL
                setProductImage(image);
              }}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Update Button */}
          <button
            type="button"
            onClick={handleUpdate}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Asset'}
          </button>
        </form>
      </div>
    </div>
  );
}
