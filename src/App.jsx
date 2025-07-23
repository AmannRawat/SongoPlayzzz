import React, { useState } from "react";
import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/sidebar';
import Content from './components/Content';
// import Playbar from './components/Playbar';

function App() {
  const [currentSection, setCurrentSection] = useState("home");
  return (
    <div className="main-layout">
      <Sidebar onSectionChange={setCurrentSection} />
      <div className="Content">
        {/* <Navbar /> */}
        <Content section={currentSection} />
        {/* <Playbar /> */}
      </div>
    </div>
  );

}

export default App;
