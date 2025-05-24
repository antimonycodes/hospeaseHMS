import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
// import { useAuthStore } from "../store/useAuthStore";
import Cookies from "js-cookie";
const ProtectedRoutes = () => {
  //   const { isAuthenticated } = useAuthStore();
  //   console.log(isAuthenticated);
  const token = Cookies.get("hhmstxt");

  return token ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoutes;
