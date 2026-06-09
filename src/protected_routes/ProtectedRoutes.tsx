import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAppContext } from "src/context/appContext";
import AppLayout from "src/layout";

const PrivateRoutes = () => {
  const { setUserDetails } = useAppContext();
  // 1.After login, user details   // TODO
  // 2.User entiteled routes from summary

  // {
  //     userRoutes:["dashboard", "storage"]
  // }

  // 1.Valid token: if not logout
  // 2. Valid Entitelment: notification of not having permission.

  useEffect(() => {
    let details = sessionStorage.getItem("userDetails");
    setUserDetails(JSON.parse(details ?? ""));
  }, []);

  return true ? (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoutes;
