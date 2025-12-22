import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import Manegerlar from "../pages/Manegerlar";
import Adminlar from "../pages/Adminlar";
import Ustozlar from "../pages/Ustozlar";
import Guruhlar from "../pages/Guruhlar";
import Studentlar from "../pages/Studentlar";
import Kurslar from "../pages/Kurslar";
import Payment from "../pages/Payment";
import Sozlamalar from "../pages/Sozlamalar";
import Profile from "../pages/Profile";
import Asosiy from "../pages/Asosiy";
import Loginpage from "../pages/Login";
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
      { index: true, element: <Asosiy /> },
      { path: "manegerlar", element: <Manegerlar /> },
      { path: "adminlar", element: <Adminlar /> },
      { path: "ustozlar", element: <Ustozlar /> },
      { path: "guruhlar", element: <Guruhlar /> },
      { path: "studentlar", element: <Studentlar /> },
      { path: "kurslar", element: <Kurslar /> },
      { path: "payment", element: <Payment /> },
      { path: "sozlamalar", element: <Sozlamalar /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
