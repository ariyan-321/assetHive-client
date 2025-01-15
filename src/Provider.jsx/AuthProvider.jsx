import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth } from "../Firebase/firebase";
import LoadingSpinner from "../Components/SubComponents/LoagingSpinner";
import useAxiosPublic from "../Hooks/useAxiosPublic";

// Create context
export const authContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Initialize user as null
  const [loading, setLoading] = useState(true); // Set default loading to true
  const axiosPublic = useAxiosPublic();

  const provider = new GoogleAuthProvider();

  // Create profile
  const createProfile = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoading(false);
        return userCredential;
      })
      .catch((error) => {
        setLoading(false);
        throw error;
      });
  };

  // Google login
  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, provider)
      .then((result) => {
        setLoading(false);
        return result;
      })
      .catch((error) => {
        setLoading(false);
        throw error;
      });
  };

  // Log out
  const logOut = () => {
    setLoading(true);
    return signOut(auth)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        throw error;
      });
  };

  // User login
  const userLogin = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoading(false);
        return userCredential;
      })
      .catch((error) => {
        setLoading(false);
        throw error;
      });
  };

  // Update user profile
  const updateUserProfile = (updatedData) => {
    return updateProfile(auth.currentUser, updatedData);
  };

  // Handle user state changes

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userInfo = { email: currentUser?.email };
        axiosPublic
          .post("/jwt", userInfo)
          .then((res) => {
            if (res.data.token) {
              localStorage.setItem("access-token", res.data.token);
            }
          })
          .catch((err) => {
            console.error("JWT token fetch failed", err);
          })
          .finally(() => setLoading(false)); // Ensure loading is reset
      } else {
        localStorage.removeItem("access-token");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [axiosPublic]); // Ensure axiosPublic is stable or memoized

  // Auth context data
  const authInfo = {
    user,
    loading,
    createProfile,
    googleLogin,
    logOut,
    userLogin,
    updateUserProfile,
  };

  return (
    <authContext.Provider value={authInfo}>
      {loading ? <LoadingSpinner></LoadingSpinner> : children}{" "}
      {/* Render children only after loading */}
    </authContext.Provider>
  );
}
