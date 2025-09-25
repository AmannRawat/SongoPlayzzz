import React from 'react';
import './BottomNav.css';
import { GoHome, GoSearch, GoStack } from "react-icons/go"; // Import icons

function BottomNav({ onSectionChange }) {
  return (
    <nav className="bottom-nav">
      <div className="nav-item" onClick={() => onSectionChange("home")}>
        <GoHome className="nav-icon" />
        <span>Home</span>
      </div>
      <div className="nav-item" onClick={() => onSectionChange("search")}>
        <GoSearch className="nav-icon" />
        <span>Search</span>
      </div>
      <div className="nav-item" onClick={() => onSectionChange("library")}>
        <GoStack className="nav-icon" />
        <span>Library</span>
      </div>
    </nav>
  );
}

export default BottomNav;