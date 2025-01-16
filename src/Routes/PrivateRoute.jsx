import React, { useContext } from "react";
import { authContext } from "../Provider.jsx/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../Components/SubComponents/LoagingSpinner";

function PrivateRoute({ children }) {
  const { user, loading } = useContext(authContext);
  const location = useLocation();

  console.log(location.pathname)

  if (loading) {
    return (
      <LoadingSpinner></LoadingSpinner>
    );
  }

  if (user && user?.email) {
    return children;
  }

  return <Navigate state={location?.pathname} to={"/login"}></Navigate>;
}

export default PrivateRoute;
