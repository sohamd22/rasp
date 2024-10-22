import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineSearch, AiOutlineMessage, AiOutlineTeam, AiOutlineEdit, AiOutlineCode } from "react-icons/ai";
import { IoMdLogOut } from "react-icons/io";

interface NavbarProps {
    currentTab: string;
    setCurrentTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
    return (
        <nav className="z-10 fixed bottom-0 left-0 w-full h-16 md:h-screen md:w-16 flex flex-row md:flex-col justify-between md:justify-center items-center md:sticky md:top-0 bg-neutral-900">
            <ul className="flex flex-row md:flex-col justify-between md:justify-center items-center w-full md:w-auto md:gap-6">
                <li onClick={() => setCurrentTab("editProfile")} className="flex-1 md:flex-auto">
                    <Link to="#" className="flex items-center justify-center w-full h-16">
                        <AiOutlineEdit size={24} className={currentTab === "editProfile" ? "text-orange-500" : "text-white"} />
                    </Link>
                </li>
                <li onClick={() => setCurrentTab("search")} className="flex-1 md:flex-auto">
                    <Link to="#" className="flex items-center justify-center w-full h-16">
                        <AiOutlineSearch size={24} className={currentTab === "search" ? "text-orange-500" : "text-white"} />
                    </Link>
                </li>
                <li onClick={() => setCurrentTab("chat")} className="flex-1 md:flex-auto">
                    <Link to="#" className="flex items-center justify-center w-full h-16">
                        <AiOutlineMessage size={24} className={currentTab === "chat" ? "text-orange-500" : "text-white"} />
                    </Link>
                </li>
                <li onClick={() => setCurrentTab("community")} className="flex-1 md:flex-auto">
                    <Link to="#" className="flex items-center justify-center w-full h-16">
                        <AiOutlineTeam size={24} className={currentTab === "community" ? "text-orange-500" : "text-white"} />
                    </Link>
                </li>
                <li onClick={() => setCurrentTab("devspace")} className="flex-1 md:flex-auto">
                    <Link to="#" className="flex items-center justify-center w-full h-16">
                        <AiOutlineCode size={24} className={currentTab === "devspace" ? "text-orange-500" : "text-white"} />
                    </Link>
                </li>
                <li className="flex-1 md:flex-auto md:mt-auto">
                    <a href="/api/auth/logout" className="flex items-center justify-center w-full h-16">
                        <IoMdLogOut size={24} className="text-red-500" />
                    </a>
                </li>                
            </ul>
        </nav>
    );
};

export default Navbar;
