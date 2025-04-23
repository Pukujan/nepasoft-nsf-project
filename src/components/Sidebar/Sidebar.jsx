import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sidebarContents from './sidebar-contents.json';

const Sidebar = () => {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [toggleSidebar, setToggleSidebar] = useState(true); // Sidebar visibility
  const navigate = useNavigate();

  const toggleElement = (id) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubContentClick = (url) => {
    if (url) {
      navigate(url);
    }
  };

  return (
    <div className={`w-[266px] ${toggleSidebar ? 'border-r border-border h-screen' : ''}`}>
      <div className="flex items-center justify-between gap-10 p-6 h-20 ">
        <button className='flex items-center gap-2'>
          <img src="/icons/logo.png" alt="Logo" />
          <img
            src="/icons/dropdown-icon.png"
            alt="Dropdown"
            className="transform transition-transform duration-200 " />
        </button>
        <span className={`${toggleSidebar ? 'hidden' : 'block'}`}>NSF Project</span>
        {/* Sidebar Toggle Button (Icon Only) */}
        <div className={`  `}>
          <button
            onClick={() => setToggleSidebar((prev) => !prev)}
            className="p-2 hover:bg-gray-100 rounded transition"
          >

            <img src="/icons/sidebar-toggle-icon.png" alt="Toggle Sidebar" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Sidebar Content */}
      {toggleSidebar && (
        <div className=" border-r border-border  h-full rounded-tr-[16px] rounded-br-[16px] overflow-hidden">
          <div className="px-4 py-2 font-medium">
            {/* NSF Project Dropdown */}
            <button
              className="flex items-center gap-4 w-full text-lg font-medium text-left py-2 px-4 rounded-lg"
              onClick={() => toggleElement('NSF_Project')}
            >
              <span>NSF Project</span>
              <img
                src="/icons/dropdown-icon.png"
                alt="Dropdown"
                className={`transform transition-transform duration-200 ${openDropdowns['NSF_Project'] ? 'rotate-180' : 'rotate-0'
                  }`}
              />
            </button>

            {/* Dropdown Content */}
            {openDropdowns['NSF_Project'] && (
              <div className="w-[240px]">
                {sidebarContents.map((element) => (
                  <div key={element.id}>
                    <button
                      onClick={() => toggleElement(element.id)}
                      className={`flex justify-between items-center w-full rounded-lg p-2 text-left gap-4 ${openDropdowns[element.id] ? 'bg-gray-200' : 'bg-white'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <img className="h-5 w-5" src={element.icon} alt={element.name} />
                        <span>{element.name}</span>
                      </div>
                      <img
                        src="/icons/line-sidebar.png"
                        alt="Expand"
                        className={`transform transition-transform duration-200 ${openDropdowns[element.id] ? 'rotate-180' : 'hidden'
                          }`}
                      />
                    </button>

                    {/* Sub-menu */}
                    {openDropdowns[element.id] && element.subContents && (
                      <div className="pl-5">
                        {element.subContents.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => handleSubContentClick(sub.url)}
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
      )}
    </div>
  );
};

export default Sidebar;
