import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Logout } from "../slice/auth";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(Logout());
    navigate("/login", { replace: true });
  };

  return (
    <button
      onClick={logoutHandler}
      className="flex items-center gap-2 text-xl hover:w-full hover:border border-gray-200 rounded-lg p-1 "
    >
      <span>
        {" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-log-out"
          aria-hidden="true"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" x2="9" y1="12" y2="12"></line>
        </svg>
      </span>
      <span>chiqish</span>
    </button>
  );
};

export default LogoutButton;
