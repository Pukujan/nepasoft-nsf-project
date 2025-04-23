import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import sidebarContents from './sidebar-contents.json'; // Import the JSON file

const Sidebar = () => {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const navigate = useNavigate(); // Initialize useNavigate hook

  const toggleElement = (id) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubContentClick = (url) => {
    if (url) {
      navigate(url); // Navigate to the provided URL
    }
  };

  return (
    <div className=" border-r-[1px] rounded-tr-[16px] rounded-br-[16px] w-[256px] h-screen border-border ">
      <div className="px-4 py-2 font-medium">
        {/* NSF Project Dropdown */}
        <button
          className="flex items-center gap-4 w-full text-lg font-medium text-left py-2 px-4 rounded-lg"
          onClick={() => toggleElement('NSF_Project')} // Replace 'NSF_Project' with your desired ID
        >
          <span>NSF Project</span>
          <img
            src="/icons/dropdown-icon.png"
            alt="Dropdown"
            className={` transform transition-transform duration-200 ${openDropdowns['NSF_Project'] ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>

        {/* Dropdown Content */}
        {openDropdowns['NSF_Project'] && (
          <div className="w-[240px]">
            {sidebarContents.map((element) => (
              <div key={element.id}>
                <button
                  onClick={() => toggleElement(element.id)}
                  className={` flex justify-between items-center w-full rounded-lg p-2 text-left gap-4
                    ${openDropdowns[element.id] ? 'bg-gray-200' : 'bg-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <img className="h-5 w-5" src={element.icon} alt={element.name} />
                    <span>{element.name}</span>
                  </div>
                  <img
                    src="/icons/dropdown-icon.png"
                    alt="Expand"
                    className={` transform transition-transform duration-200 rotate-180 ${openDropdowns[element.id] ? 'block' : 'hidden'}`}
                  />
                </button>

                {/* Element-specific Dropdown */}
                {openDropdowns[element.id] && element.subContents && (
                  <div className="pl-5">
                    {element.subContents.map((sub) => (
                      <button
                        onClick={() => handleSubContentClick(sub.url)} // Pass the URL to navigate
                        key={sub.id}
                        className="w-full p-2 text-left items-center flex gap-4 hover:text-black transition"
                      >
                        <img className="w-4 h-4" src={sub.icon} alt="" />
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
