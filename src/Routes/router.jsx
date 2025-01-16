import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainHome from "../Components/MainHome";
import Home from "../Components/Home";
import JoinAsAnEmployee from "../Pages/JoinAsAnEmployee";
import JoinAsAHrManager from "../Pages/JoinAsAHrManager";
import Login from "../Pages/Login";
import AddAnAsset from "../Pages/hrPages/AddAnAsset";
import AssetList from "../Pages/hrPages/AssetList";
import AddAnEmployee from "../Pages/hrPages/AddAnEmployee";
import RequestForAnAsset from "../Pages/employeePages/RequestForAnAsset";
import MyEmployeeList from "../Pages/hrPages/MyEmployeeList";
import Profile from "../Pages/Profile/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainHome></MainHome>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/add-an-asset",
        element: <AddAnAsset></AddAnAsset>,
      },
      {
        path: "/asset-list",
        element: <AssetList></AssetList>,
      },
      {
        path: "/add-an-employee",
        element: <AddAnEmployee></AddAnEmployee>,
      },
      {
        path: "/request-for-an-asset",
        element: <RequestForAnAsset></RequestForAnAsset>,
      },
      {
        path: "/my-employee-list",
        element: <MyEmployeeList></MyEmployeeList>,
      },
      {
        path: "/profile",
        element: <Profile></Profile>,
      },
    ],
  },
  {
    path: "/join-as-an-employee",
    element: <JoinAsAnEmployee></JoinAsAnEmployee>,
  },
  {
    path: "/join-as-hr-manager",
    element: <JoinAsAHrManager></JoinAsAHrManager>,
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
]);
