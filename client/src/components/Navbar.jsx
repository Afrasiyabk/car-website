import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import avator from "../assets/avator.jpg";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const {logout , user} = useAuth();
  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-600 hover:text-blue-500"
    }`;


  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
            <Link to={"/"} className="flex items-center gap-2">
            <img className="w-12 h-12 object-cover" src={logo} alt="logo" />
            <span className="nosifer text-lg font-semibold text-gray-800">
              Rental Car
            </span>
            </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex md:items-center md:gap-6">
            <NavLink
              to={"/"}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to={"/cars-list"}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Cars
            </NavLink>
            <NavLink
              to={"/bookmarks"}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Bookmarks
            </NavLink>

            {user && (
              <NavLink
                to={"/dashboard"}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Dashboard
              </NavLink>
            )}
          </nav>

          <div className="flex items-center justify-between gap-2">
            {!user && (
              <div className="flex items-center justify-center gap-2">
                <Link to={"/signup"}>
                  <Button className="text-white! bg-blue-600! hover:bg-blue-700! p-2!">
                    Sign up
                  </Button>
                </Link>
                <Link to={"/login"}>
                  <Button className="text-white! bg-blue-600! hover:bg-blue-700! p-2!">
                    Login
                  </Button>
                </Link>
              </div>
            )}

            {user && (
              <div 
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center justify-center w-[40px] h-[40px] md:w-[50px] md:h-[50px] overflow-hidden rounded-full border-3 bg-blue-600 border-blue-600 cursor-pointer"
                >
                 <span className='nosifer text-white text-2xl'>{user.name.charAt(0)}</span>
                </motion.div>
                
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50 p-2"
                    >
                      <div className="py-1">
                        <Link to="/bookmarks">
                          <motion.button
                            whileHover={{ backgroundColor: "#2563eb" }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full text-left px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 transition-colors uppercase font-semibold cursor-pointer"
                          >
                            Bookmark
                          </motion.button>
                        </Link>
                        <motion.button
                          
                          whileTap={{ scale: 0.98 }}
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 transition-colors uppercase font-semibold mt-2 cursor-pointer"
                        >
                          Logout
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setOpen((s) => !s)}
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-orange-500 focus:outline-none"
              >
                {open ? (
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        <motion.div
          initial={false}
          animate={open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          className="md:hidden border-t border-gray-100 overflow-hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to={"/"}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to={"/cars-list"}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Cars
            </NavLink>
            <NavLink
              to={"/bookmarks"}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Bookmarks
            </NavLink>
            {user && (
              <NavLink
                to={"/dashboard"}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Dashboard
              </NavLink>
            )}
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Navbar;