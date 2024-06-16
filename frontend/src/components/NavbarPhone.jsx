import React from "react";
import {
  ChartBarIcon,
  BanknotesIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import {
  ChartBarIcon as ChartBarOutlined,
  BanknotesIcon as BanknotesOutlined,
  QuestionMarkCircleIcon as QuestionMarkCircleOutlined,
  UserCircleIcon as UserCircleOutlined,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

function NavbarPhone() {
  const { logout } = useAuth();

  const location = useLocation();
  const currentRoute = location.pathname;

  const renderTabButton = (
    tabName,
    activeIconComponent,
    IconComponent,
    path
  ) => {
    const isActive = currentRoute === path;
    return (
      <NavLink
        key={tabName}
        to={path}
        className={`flex flex-col items-center text-gray-500 ${
          isActive ? "text-[#a51417]" : ""
        }`}
      >
        <IconRenderComponent
          IconComponent={isActive ? activeIconComponent : IconComponent}
          isActive={isActive}
        />

        <span
          className={`text-sm ${isActive ? "text-[#a51417]" : "text-gray-500"}`}
        >
          {tabName}
        </span>
      </NavLink>
    );
  };

  const IconRenderComponent = ({ IconComponent, isActive }) => (
    <div
      className={`h-8 w-[74px] mb-1 pt-1 flex justify-center items-center ${
        isActive
          ? "border-t-2 border-[#a51417]"
          : "border-t-2 border-transparent"
      }`}
    >
      <IconComponent
        className={`h-6 w-6 ${isActive ? "text-[#a51417]" : "text-gray-900"}`}
      />
    </div>
  );

  const renderLogoutButton = () => {
    return (
      <button
        className="flex flex-col items-center text-gray-500"
        onClick={logout}
      >
        <IconRenderComponent
          IconComponent={ArrowRightOnRectangleIcon}
          isActive={false}
        />
        <span className="text-sm text-gray-500">Log out</span>
      </button>
    );
  };

  return (
    <div className="flex justify-between items-center bg-white px-3 pb-2 shadow-lg shadow-gray-800">
      {renderTabButton("Dashboard", ChartBarIcon, ChartBarOutlined, "/")}
      {renderTabButton("My Bid", BanknotesIcon, BanknotesOutlined, "/mybid")}
      {renderTabButton(
        "FAQ",
        QuestionMarkCircleIcon,
        QuestionMarkCircleOutlined,
        "/faq"
      )}
      {renderTabButton(
        "Profile",
        UserCircleIcon,
        UserCircleOutlined,
        "/profile"
      )}
      {renderLogoutButton()}
    </div>
  );
}

export default NavbarPhone;
