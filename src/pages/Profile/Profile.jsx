import { useState } from "react";
import { UserCircleIcon } from "../../icons";
import { General } from "./General";
import { ChangePassword } from "./ChangePassword";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb"


export default function Profile() {
  const {t}=useTranslation()
  const tabs = [
    { name: t("GENERAL"), icon: <UserCircleIcon />, content: <General/> },
    { name: t("CHANGE_PASSWORD"), icon: <UserCircleIcon />, content: <ChangePassword/> },
    { name: t("NOTIFICATION"), icon: <UserCircleIcon />, content: "Notification details" },
  ];

  const [activeTab, setActiveTab] = useState("General");

  const breadcrumbPaths = [
    { label: t('PROFILE'), href: "/profile" },
  ];

  return (
    <div className="">
      {/* Profile Heading */}
        <Breadcrumb paths={breadcrumbPaths} />

      {/* Tabs */}
      <div className="border-b">
        <div className="flex flex-wrap md:flex-nowrap gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-4 py-2 text-gray-600 border-b-2 ${
                activeTab === tab.name ? "border-blue-500 text-blue-600 font-semibold" : "border-transparent"
              } hover:text-blue-500 transition-all`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Box */}
      <div className="sm:p-1 mt-4">
        <p className="text-gray-600 mt-2">{tabs.find((tab) => tab.name === activeTab)?.content}</p>
      </div>
    </div>
  );
}
