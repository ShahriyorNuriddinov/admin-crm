import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Chiqish = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }, [navigate]);

  return <div>Chiqish qilindi...</div>;
};

export default Chiqish;
