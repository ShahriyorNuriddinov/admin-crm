import { PanelRight } from "lucide-react";
import Breadcrumb from "./Breadcrumb";
import { useSelector } from "react-redux";
const Header = () => {
  const { loggedIn, user } = useSelector((state) => state.auth);
  return (
    <header className="flex w-full justify-between items-center p-4 bg-gray-100">
      <div className="flex items-center gap-3 font-medium">
        <PanelRight />
        <Breadcrumb />
      </div>

      <div>
        {loggedIn && user ? (
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <span>
                {user.first_name} {user.last_name}
              </span>
              <span className="text-sm flex items-center gap-2">
                ({user.role})
              </span>
            </div>
          </div>
        ) : (
          <span>Guest</span>
        )}
      </div>
    </header>
  );
};

export default Header;
