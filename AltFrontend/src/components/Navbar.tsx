import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, Users, Home } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed w-full backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Camera className="h-6 w-6 text-textMain" />
              <span className="font-semibold text-textMain">ClaimReady</span>
            </Link>
          </div>
          
          <div className="flex space-x-8">
            <Link
              to="/"
              className={`inline-flex items-center px-1 pt-1 text-sm font-bold ${
                location.pathname === '/'
                  ? 'text-textMain border-b-2 border-textMain'
                  : 'text-textMain hover:text-textHover'
              }`}
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            
            <Link
              to="/upload"
              className={`inline-flex items-center px-1 pt-1 text-sm font-bold ${
                location.pathname === '/upload'
                  ? 'text-textMain border-b-2 border-textMain'
                  : 'text-textMain hover:text-textHover'
              }`}
            >
              <Camera className="h-4 w-4 mr-1" />
              Upload
            </Link>
            
            <Link
              to="/about"
              className={`inline-flex items-center px-1 pt-1 text-sm font-bold ${
                location.pathname === '/about'
                  ? 'text-textMain border-b-2 border-textMain'
                  : 'text-textMain hover:text-textHover'
              }`}
            >
              <Users className="h-4 w-4 mr-1" />
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;