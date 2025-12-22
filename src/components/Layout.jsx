import React from "react";
import { Outlet } from "react-router-dom";
import Aside from "./Aside";
import Header from "./Header";
import Main from "./Main";

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r h-full flex flex-col">
        <div className="font-bold text-xl p-4">Admin CRM</div>
        <div className="mx-5"><Main /></div>
      </aside>
      <div className="flex-1 flex flex-col">
        <div className="border h-15 flex items-center">
          <Header/>
        </div>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
