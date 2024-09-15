import React from "react";
import { useLocation, Link } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  // console.log("Location ", location.pathname);
  return (
    <div className="bg-[#3C3C3C] h-[90px] flex justify-center">
      <div className="h-full w-[80%] flex items-center justify-between">
        <span className="text-3xl cursor-pointer">
          {" "}
          <Link to="/">Whiteboard-App</Link>{" "}
        </span>
        <span className="text-xl cursor-pointer">
          <Link to={location.pathname === "/" ? "/designs" : "/"}>
            {location.pathname === "/" ? "Your design" : "Create design"}
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Navbar;
