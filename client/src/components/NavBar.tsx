// src/components/Navbar.tsx

import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineSearch, AiOutlineMessage, AiOutlineTeam, AiOutlineEdit } from "react-icons/ai";
import { IoMdLogOut } from "react-icons/io";

interface NavbarProps {
    currentTab: string;
    setCurrentTab: (tab: string) => void;
    Logout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, Logout }) => {
    return (
        <nav className="h-screen w-16 flex flex-col justify-center items-center" style={{ backgroundColor: '#262626' }}>
            <ul className="flex flex-col gap-6">
                <li onClick={() => setCurrentTab("editProfile")}>
                    <Link to="#" className={`flex items-center justify-center w-full h-16`}>
                        <AiOutlineEdit size={24} className={currentTab === "editProfile" ? "text-orange-500" : "text-white"} />
                    </Link>
                </li>
                <li onClick={() => setCurrentTab("search")}>
                    <Link to="#" className={`flex items-center justify-center w-full h-16`}>
                        <AiOutlineSearch size={24} className={currentTab === "search" ? "text-orange-500" : "text-white"} />
                    </Link>
                </li>
                <li onClick={() => setCurrentTab("chat")}>
                    <Link to="#" className={`flex items-center justify-center w-full h-16`}>
                        <AiOutlineMessage size={24} className={currentTab === "chat" ? "text-orange-500" : "text-white"} />
                    </Link>
                </li>
                <li onClick={() => setCurrentTab("community")}>
                    <Link to="#" className={`flex items-center justify-center w-full h-16`}>
                        <AiOutlineTeam size={24} className={currentTab === "community" ? "text-orange-500" : "text-white"} />
                    </Link>
                </li>

                <li onClick={Logout} className="justify-self-end">
                    <Link to="#" className={`flex items-center justify-center w-full h-16`}>
                        <IoMdLogOut size="24" className="text-red-500" />
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
