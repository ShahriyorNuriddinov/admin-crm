
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import Manegerlar from "../pages/Manegerlar";
import Adminlar from "../pages/Adminlar";
import Ustozlar from "../pages/Ustozlar";
import Guruhlar from "../pages/Guruhlar";
import Studentlar from "../pages/Studentlar";
import Kusrlar from "../pages/Kurslar";
import Payment from "../pages/Payment";
import Sozlamalar from "../pages/Sozlamalar";
import Profile from "../pages/Profile";
import Chiqish from "../pages/Chiqish";
import Asosiy from "../pages/Asosiy/index";
import Loginpage from "../pages/Login/index";
import PrivateRoute from "../components/PrivateRoute"; 

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Loginpage />,
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Asosiy />,
      },
      {
        path: "manegerlar",
        element: <Manegerlar />,
      },
      {
        path: "adminlar",
        element: <Adminlar />,
      },
      {
        path: "ustozlar",
        element: <Ustozlar />,
      },
      {
        path: "guruhlar",
        element: <Guruhlar />,
      },
      {
        path: "studentlar",
        element: <Studentlar />,
      },
      {
        path: "kurslar",
        element: <Kusrlar />,
      },
      {
        path: "payment",
        element: <Payment />,
      },
      {
        path: "sozlamalar",
        element: <Sozlamalar />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "chiqish",
        element: <Chiqish />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;