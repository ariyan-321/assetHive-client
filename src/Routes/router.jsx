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
import MyTeam from "../Pages/employeePages/MyTeam";
import AllRequests from "../Pages/hrPages/AllRequests";
import UpdaeAsset from "../Pages/hrPages/UpdaeAsset";
import IncreaseLimit from "../Pages/hrPages/IncreaseLimit";
import Payment from "../Pages/hrPages/Payment";
import NotFound from "../Pages/NotFound";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainHome></MainHome>,
    errorElement:<NotFound></NotFound>,
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
        path: "/all-requests",
        element: (
          <PrivateRoute>
            <HrRoute>
              <AllRequests></AllRequests>
            </HrRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "/update/asset/:id",
        element: (
          <PrivateRoute>
            <HrRoute>
              <UpdaeAsset></UpdaeAsset>
            </HrRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "/increase-limit",
        element: (
          <PrivateRoute>
            <HrRoute>
              <IncreaseLimit></IncreaseLimit>
            </HrRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "/payment",
        element: (
          <PrivateRoute>
          
              <Payment></Payment>
           
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
        path: "/my-team",
        element: (
          <PrivateRoute>
            <MyTeam></MyTeam>
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
