import React from "react";
import { FaCouch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";



const UserDashboardHeader = () => {
    const navigate = useNavigate();;


    const handleLogout = () => {
        localStorage.clear();;
        navigate('/')
    }

    return (
        <header className="bg-gray-900 text-white fixed w-full top-0 z-50">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col items-center">
                            <span className="block text-2xl -mt-1">SEAT</span>
                            <span className="block text-sm tracking-widest">NERD</span>
                        </div>
                        <FaCouch className="w-8 h-8" />
                    </div>

                    <nav className="flex items-center space-x-6">

                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors"
                        >
                            Logout
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default UserDashboardHeader;