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
import PrivateRoute from "./PrivateRoute";
import HrRoute from "./HrRoute";
import MyAssets from "../Pages/employeePages/MyAssets";

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
        element: (
          <PrivateRoute>
            <HrRoute>
              <AddAnAsset></AddAnAsset>
            </HrRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "/asset-list",
        element: (
          <PrivateRoute>
            <HrRoute>
              <AssetList></AssetList>
            </HrRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "/add-an-employee",
        element: (
          <PrivateRoute>
            <HrRoute>
              <AddAnEmployee></AddAnEmployee>
            </HrRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "/request-for-an-asset",
        element: (
          <PrivateRoute>
            <RequestForAnAsset></RequestForAnAsset>
          </PrivateRoute>
        ),
      },
      {
        path: "/my-assets",
        element: (
          <PrivateRoute>
            <MyAssets></MyAssets>
          </PrivateRoute>
        ),
      },
      {
        path: "/my-employee-list",
        element: (
          <PrivateRoute>
            <HrRoute>
              <MyEmployeeList></MyEmployeeList>
            </HrRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile></Profile>
          </PrivateRoute>
        ),
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
