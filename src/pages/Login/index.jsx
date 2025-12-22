import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Login from '../../components/Login';

function Loginpage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedIn } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (loggedIn) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [loggedIn, navigate, location]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <Login />
    </div>
  );
}

export default Loginpage;