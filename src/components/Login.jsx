import { useEffect, useState } from "react";
import Input from "./Input";
import { useDispatch, useSelector } from "react-redux";
import {
  LogginUserFailure,
  LogginUserStart,
  LogginUserSuccess,
} from "../slice/auth";
import { ThreeDot } from "react-loading-indicators";
import AuthSrevice from "./../service/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { isLoading, loggedIn } = auth;

  useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  }, [loggedIn, navigate]);

  const loginHandler = async (e) => {
    e.preventDefault();
    dispatch(LogginUserStart());
    try {
      const response = await AuthSrevice.userloggin({ email, password });
      dispatch(LogginUserSuccess(response));
      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Xatolik yuz berdi";
      dispatch(LogginUserFailure(errorMessage));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <form onSubmit={loginHandler} className="w-full">
        <div className="backdrop-blur bg-white/5 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 mx-auto">
          <h2 className="font-semibold text-xl text-center text-gray-800 mb-2">
            Xush kelibsiz 👋
          </h2>

          <p className="text-gray-600 text-sm text-center mb-6">
            Hisobingizga kirish uchun email va parolni kiriting
          </p>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email
            </label>
            <Input
              label="Email kiriting"
              type="email"
              state={email}
              setState={setEmail}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Parol
            </label>
            <Input
              label="Password"
              type="password"
              state={password}
              setState={setPassword}
              required
            />
          </div>
          {auth.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{auth.error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#322F2E] p-3 rounded-xl hover:bg-amber-950 text-white transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex justify-center">
                <ThreeDot
                  color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
                  size="small"
                />
              </div>
            ) : (
              "Kirish"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
