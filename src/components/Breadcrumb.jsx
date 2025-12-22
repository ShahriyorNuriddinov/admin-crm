import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);

  const crumbs = parts.map((crumb, index) => {
    const currentLink = "/" + parts.slice(0, index + 1).join("/");
    const crumbText = crumb.charAt(0).toUpperCase() + crumb.slice(1);
    return (
      <span key={index} className="flex items-center">
        <span className="mx-2 font-medium">{" > "}</span>
        <Link to={currentLink} className="">
          {crumbText}
        </Link>
      </span>
    );
  });

  return (
    <nav className="">
      <div className="flex items-center  font-medium md:text-base">
        <Link to="/" className="">
          Asosiy
        </Link>
        {crumbs}
      </div>
    </nav>
  );
};

export default Breadcrumb;
