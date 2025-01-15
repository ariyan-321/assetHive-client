import React, { useContext } from "react";
import { authContext } from "../Provider.jsx/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children }) {
  const { user, loading } = useContext(authContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid justify-items-center mt-12">
        <span className="loading loading-bars loading-lg text-4xl"></span>
      </div>
    );
  }

  if (user && user?.email) {
    return children;
  }

  return <Navigate state={location?.pathname} to={"/login"}></Navigate>;
}

export default PrivateRoute;
