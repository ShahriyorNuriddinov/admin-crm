import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  let currentLink = "";

  const crumbs = location.pathname
    .split("/")
    .filter((crumb) => crumb !== "")
    .map((crumb, index) => {
      currentLink += `/${crumb}`;
      const crumbText = crumb.charAt(0).toUpperCase() + crumb.slice(1);
      return (
        <span key={index} className="flex items-center">
          <span className="mx-2 font-medium">{" > "}</span>
          <Link
            to={currentLink}
            className=""
          >
            {crumbText}
          </Link>
        </span>
      );
    });

  return (
    <nav className="">
      <div className="flex items-center  font-medium md:text-base">
        <Link
          to="/"
          className=""
        >
          Asosiy
        </Link>
        {crumbs}
      </div>
    </nav>
  );
};

export default Breadcrumb;
