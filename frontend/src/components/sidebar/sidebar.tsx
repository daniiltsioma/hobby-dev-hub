import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        setIsButtonVisible(true);
      }, 100);
      return () => clearTimeout(timeoutId);
    } else {
      setIsButtonVisible(false);
    }
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Menu Button inside Sidebar */}
      {isOpen && isButtonVisible && (
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 ght-3 z-50 left-45 bg-[#0d1117] text-white border border-[#3d444d] rounded-lg px-4 py-2 flex items-center gap-2"
        >
          <span style={{ fontSize: "10px" }}>❌</span>
        </button>
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed left-0 top-0 h-full w-60 bg-[#161b22] text-white border-r border-[#3d444d] transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40`}
      >
        {/* Sidebar Content */}
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Collaborations</h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                className="w-full text-left p-2 rounded hover:bg-[#1f2937] transition"
              >
                View Projects
              </button>
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
      </div>
    </div>
  );
};

export default Sidebar;
