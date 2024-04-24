import React, { useState } from "react";
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

function NavbarPhone({ activeTab, setActiveTab, handleClick = null }) {
  const renderTabButton = (tabName, IconComponent) => {
    const isActive = activeTab === tabName;
    return (
      <button
        className={`flex flex-col items-center text-gray-500 ${
          isActive ? "text-[#a51417]" : ""
        }`}
        onClick={() => setActiveTab(tabName)}
      >
        <IconRenderComponent
          IconComponent={IconComponent}
          isActive={isActive}
        />
        <span
          className={`text-sm ${isActive ? "text-[#a51417]" : "text-gray-500"}`}
        >
          {tabName}
        </span>
      </button>
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
        onClick={handleClick}
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
      {activeTab === "Dashboard"
        ? renderTabButton("Dashboard", ChartBarIcon)
        : renderTabButton("Dashboard", ChartBarOutlined)}
      {activeTab === "My Bid"
        ? renderTabButton("My Bid", BanknotesIcon)
        : renderTabButton("My Bid", BanknotesOutlined)}
      {activeTab === "FAQ"
        ? renderTabButton("FAQ", QuestionMarkCircleIcon)
        : renderTabButton("FAQ", QuestionMarkCircleOutlined)}
      {activeTab === "Profile"
        ? renderTabButton("Profile", UserCircleIcon)
        : renderTabButton("Profile", UserCircleOutlined)}
      {renderLogoutButton()}
    </div>
  );
}

export default NavbarPhone;
