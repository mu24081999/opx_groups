import React from "react";
import logo from "../assets/00-logo.png";
const MainLayer = () => {
  return (
    <div className="flex items-center justify-center h-screen ">
      <img src={logo} alt="Logo" className="h-64 w-64 m-auto" />
    </div>
  );
};
export default MainLayer;
