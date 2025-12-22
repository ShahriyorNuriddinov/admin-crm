import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Login from "../../components/Login";

function Loginpage() {
  const navigate = useNavigate();
  const { loggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (loggedIn || token) {
      navigate("/", { replace: true });
    }
  }, [loggedIn, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Login />
    </div>
  );
}

export default Loginpage;
