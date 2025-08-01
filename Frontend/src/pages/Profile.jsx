import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  EnvelopeIcon,
  UserIcon,
  AcademicCapIcon,
  
} from "@heroicons/react/24/solid";

export default function Profile() {
  const { user } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);

  // Trigger "falling" animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setHasMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Profile info to display
  const profileItems = [
    {
      Icon: EnvelopeIcon,
      label: "Email",
      value: user?.email || "No email",
    },
    {
      Icon: UserIcon,
      label: "Name",
      value: user?.name || "No name set",
    },
    {
      Icon: AcademicCapIcon,
      label: "JLPT Level",
      value: user?.jlptLevel || "N5",
    },
  ];

  return (
    <div
      className={`
        max-w-lg mx-auto bg-white p-10 rounded-xl shadow-2xl border border-black/10 font-sans text-black
        transform transition-all duration-700 opacity-0 translate-y-12
        ${hasMounted ? "opacity-100 translate-y-0" : ""}
      `}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Profile Icon & Title */}
      <div className="flex flex-col items-center mb-10 select-none">
        <div
          className="
            w-32 h-32 rounded-full bg-black/10 flex items-center justify-center
            mb-4 shadow-inner hover:shadow-lg transition-shadow duration-700 ease-in-out"
          style={{ transformStyle: "preserve-3d" }}
        >
          <UserIcon className="h-20 w-20 text-black/70" />
        </div>
        <h1 className="text-4xl font-serifJapanese font-extrabold tracking-tight drop-shadow-sm select-text">
          Profile
        </h1>
      </div>

      {/* Profile Details */}
      <div className="space-y-8">
        {profileItems.map(({ Icon,  label, value }) => (
          <div
            key={label}
            className="
              flex items-center space-x-4 p-4 border border-black/30 rounded-lg shadow-md bg-white
              hover:shadow-lg hover:-translate-y-1 transition duration-300 ease-in-out cursor-default"
          >
            <Icon className="h-8 w-8 text-primary shrink-0" />
            <div>
              <p className="font-semibold text-black/90">{label}</p>
              <p className="text-black/80">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      {/* <button
        onClick={logout}
        className="
          mt-12 flex items-center justify-center space-x-2 text-red-600 font-semibold
          hover:text-red-800 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-red-300 rounded
          px-6 py-3 uppercase tracking-wider select-none shadow-md hover:shadow-xl"
        aria-label="Logout"
      >
        {/* <ArrowRightOnRectangleIcon className="h-6 w-6" /> */}
        {/* <span>Logout</span> */}
      {/* </button> */} 
    </div>
  );
}
