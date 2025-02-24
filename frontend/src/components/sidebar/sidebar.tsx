import { useState } from "react";
//import { TextEncoder } from "util";
//global.TextEncoder = TextEncoder;
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  return (
    <div>
      {/* Button to toggle the sidebar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#0d1117] text-white border border-[#3d444d] rounded-lg px-4 py-2"
      >
        {isOpen ? "Close Sidebar" : "View My Projects"}
      </button>

      {/* Sidebar Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-[#161b22] text-white border border-[#3d444d] rounded-lg shadow-lg">
          <ul className="p-2">
            {/* Main Menu Button: View My Porjects */}
            <li className="p-2 hover:bg-[#1f2937] rounded">
              <button
                onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                className="w-full text-left"
              >
                View My Projects
              </button>
              {/* Submenu for Active and Archived Projects */}
              {isSubMenuOpen && (
                <div className="ml-4 mt-2 bg-[#1f2937] rounded-lg shadow-lg">
                  <ul className="p-2">
                    <li className="p-2 hover:bg-[#2a3842] rounded">
                      <Link
                        to="/projects/active"
                        onClick={() => setIsOpen(false)}
                      >
                        Active Projects
                      </Link>
                    </li>
                    <li className="p-2 hover:bg-[#2a3842] rounded">
                      <Link
                        to="/projects/archived"
                        onClick={() => setIsOpen(false)}
                      >
                        Archived Projects
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
