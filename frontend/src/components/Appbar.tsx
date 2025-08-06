import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "./BlogCard";
import { X, Menu } from 'lucide-react';
import { jwtDecode } from "jwt-decode"; // Import jwt-decode


export const Appbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/signin');
    setIsMenuOpen(false); // Close the menu after logging out
    // add a toast notification too
  };

  const handleNewPostClick = () => {
    navigate("/blog/create");
    setIsMenuOpen(false); // after clicking make sure to close the menu
  };

  const handleProfileClick = () => {
    if (currentUserId) {
      navigate(`/profile/${currentUserId}`); // Navigate to the profile page with user ID
    } else {
      //toast.error("User ID not available. Please sign in.");
      navigate('/signin');
    }
    setIsMenuOpen(false); // Close the menu after clicking
  
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: { id: string } = jwtDecode(token);
        setCurrentUserId(decodedToken.id);
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem('token'); // Clear invalid token
        navigate('/signin'); // Redirect to signin
      }
    } else {
      // If no token, ensure user is redirected if on a protected route
      // This is often handled by a PrivateRoute wrapper, but good to have here too.
      // navigate('/signin'); // Uncomment if Appbar should always force signin if no token
    }
  }, [navigate]);
  return (
    <div className="border-b flex justify-between items-center px-6 py-4 md:px-10">
      {/* Left side: Logo */}
      <Link to={"/blogs"} className="flex flex-col justify-center cursor-pointer">
        <span className="font-bold text-xl">Medium</span>
      </Link>

      {/* Right side: Desktop Buttons (Visible on large screens) */}
      <div className="hidden lg:flex items-center">
        <button
          type="button"
          className="mr-4 text-white bg-green-700 hover:bg-green-800 
          focus:outline-none focus:ring-4 focus:ring-green-300 
          font-medium rounded-full text-sm px-5 py-2.5 text-center"
          onClick={handleNewPostClick}
        >
          New Post
        </button>
        <button
          type="button"
          className="mr-4 text-white bg-blue-700 hover:bg-blue-800
           focus:outline-none focus:ring-4 focus:ring-blue-300 
           font-medium rounded-full text-sm px-5 py-2.5 text-center"
          onClick={handleProfileClick}
        >
          Profile
        </button>
        <button
          type="button"
          className="mr-4 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
          onClick={handleLogout}
        >
          LogOut
        </button>
        <Avatar size="big" name="Adarsh" />
      </div>

      {/* Right side: Mobile Menu Icon/Avatar (Visible on mobile screens) */}
      <div className="lg:hidden">
        <button onClick={toggleMenu} className="p-2">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 right-0 z-50 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden
                    ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col p-6 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <Avatar size="big" name="Adarsh" />
            <button onClick={toggleMenu} className="p-2 text-gray-600 hover:text-red-600">
              <X size={28} />
            </button>
          </div>
          <button
            onClick={handleNewPostClick}
            className="w-full text-left py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            New Post
          </button>
          <button
            onClick={handleProfileClick}
            className="w-full text-left py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left py-3 px-4 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            LogOut
          </button>
        </div>
      </div>
    </div>
  );
};
