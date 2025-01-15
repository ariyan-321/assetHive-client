import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainHome from "../Components/MainHome";
import Home from "../Components/Home";
import JoinAsAnEmployee from "../Pages/JoinAsAnEmployee";
import JoinAsAHrManager from "../Pages/JoinAsAHrManager";
import Login from "../Pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainHome></MainHome>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
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
