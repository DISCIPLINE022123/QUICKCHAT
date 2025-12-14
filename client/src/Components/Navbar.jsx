import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const { setLoggedIn, isLoggedin, backUrl } = useContext(AppContent);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const Ischat= ()=>{
    const token = localStorage.getItem("token");
    if(!token){
      navigate("/login")
      return
    }
    navigate("/RoomChat")
  }
  // 🔹 Logout Handler
  const handleLogout = async () => {
    try {
      const res = await axios.get(backUrl + "/api/logout", {
        withCredentials: true, // cookie ko clear karne ke liye
      });

      if (res.data.success) {
        toast.success(res.data.message || "Logged out successfully");
        setLoggedIn(false);
        localStorage.clear();
  
        navigate("/");
      } else {
        toast.error(res.data.message || "Failed to logout");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    }
  };

  return (
    <nav 
      className="w-full flex justify-between items-center px-6 sm:px-12 py-4 fixed top-0 z-50 backdrop-blur-md border-b border-white/10 shadow-lg"
      style={{ 
        backdropFilter: 'blur(16px)',
        background: 'rgba(30, 30, 40, 0.8)'
      }}
    >
      {/* 🔹 Logo Section */}
      <div 
        className="flex items-center gap-3 cursor-pointer group transition-all duration-300 hover:scale-105"
        onClick={() => navigate("/")}
      >
        {/* Chat Bubble Icon */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
          </div>
        </div>
        
        {/* Brand Text */}
        <div className="hidden sm:block">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
            QuickChat
          </h1>
          <p className="text-xs text-purple-300/80 -mt-1">
            Chat Platform
          </p>
        </div>
      </div>

      {/* 🔹 Navigation Menu - Desktop */}
      <div className="hidden md:flex items-center gap-8">
        <button
          onClick={() => navigate("/")}
          className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium"
        >
          Home
        </button>
        <button
          onClick={Ischat}
          className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium cursor-pointer"
        >
          Chats
        </button>
        <button
          onClick={() => navigate("/contacts")}
          className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium"
        >
          Contacts
        </button>
      </div>

      {/* 🔹 Right Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Add Product Button */}
        <button
          onClick={() => navigate("/AddProduct")}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-sm cursor-pointer"
        >
          Create Room
        </button>

        {isLoggedin ? (
          /* Logout Button */
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-medium rounded-xl border border-red-400/30 hover:border-red-400/50 transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-red-400 text-sm cursor-pointer"
          >
            Logout
          </button>
        ) : (
          /* Login Button */
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-sm cursor-pointer"
          >
            Login
          </button>
        )}

        {/* Mobile Menu Button */}
        <button className="md:hidden w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;