import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="mb-4 flex space-x-4 bg-background">
        <Link to="/" className="text-textAccent hover:textHover font-bold px-5 py-2 ">Home</Link>
        <Link to="/UploadPage" className ="text-textAccent hover:textHover font-bold  py-2">Get Started</Link>
      {/* Add more links as needed */}
    </nav>
  );
};

export default Navbar;
