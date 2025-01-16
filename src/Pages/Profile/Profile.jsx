import React, { useContext, useState } from "react";
import { authContext } from "../../Provider.jsx/AuthProvider";
import { imageUpload } from "../../API/utils"; // Assuming this is an async function
import toast from "react-hot-toast";

export default function Profile() {
  const { user, updateUserProfile } = useContext(authContext);
  const [isModalOpen, setIsModalOpen] = useState(false); // To handle modal visibility
  const [newName, setNewName] = useState(user?.displayName || ""); // Name input state
  const [newImage, setNewImage] = useState(null); // Image file input state
  const [isLoading, setIsLoading] = useState(false); // Loading state for button text

  // Handle profile update
  const handleProfileUpdate = async () => {
    setIsLoading(true); // Set loading to true when update starts
    try {
      if (newImage) {
        const imageUrl = await imageUpload(newImage); // Await the async image upload
        if (imageUrl) {
          const updatedInfo = {
            displayName: newName,
            photoURL: imageUrl,
          };
          await updateUserProfile(updatedInfo); // Await user profile update
          toast.success("Profile updated successfully!");
        }
      } else {
        const updatedInfo = { displayName: newName };
        await updateUserProfile(updatedInfo); // Await user profile update
        toast.success("Profile updated successfully!");
      }
      setIsModalOpen(false); // Close the modal after update
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false); // Set loading to false when the update is complete
    }
  };

  return (
    <div>
      <h1 className="text-center my-5 text-4xl font-semibold">Your Profile</h1>
      <div className="text-center grid justify-items-center gap-2 my-5">
        <img
          className="w-[150px] h-[150px] rounded-full object-cover border-2 shadow-xl border-blue-400"
          src={user?.photoURL}
          alt="Profile"
        />
        <h1 className="font-semibold text-xl">{user?.displayName}</h1>
        <p className="text-xl">{user?.email}</p>
        {/* Update Profile Button */}
        <button
          className="btn btn-primary text-white"
          onClick={() => setIsModalOpen(true)}
        >
          Edit Profile
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Update Profile
            </h2>

            {/* Change Image */}
            <div className="mb-4">
              <label className="block font-medium mb-2" htmlFor="profileImage">
                Change Profile Image
              </label>
              <input
                type="file"
                id="profileImage"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setNewImage(e.target.files[0])}
              />
            </div>

            {/* Change Name */}
            <div className="mb-4">
              <label className="block font-medium mb-2" htmlFor="profileName">
                Change Name
              </label>
              <input
                type="text"
                id="profileName"
                placeholder="Enter New Name"
                className="input input-bordered w-full"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary text-white"
                onClick={handleProfileUpdate}
                disabled={isLoading} // Disable button while loading
              >
                {isLoading ? "Changing Updates..." : "Change Update"} {/* Button Text Change */}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
