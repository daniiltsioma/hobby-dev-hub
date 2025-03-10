import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  //const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
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
            <li className="rounded hover:bg-[#1f2937]">
              <Link
                to="/my-projects"
                onClick={() => setIsOpen(false)}
                className="block p-2"
              >
                My Projects
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
