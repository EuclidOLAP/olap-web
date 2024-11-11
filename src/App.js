import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

import Workbench from './pages/Workbench';

// 首页组件
function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>EuclidOLAP Web Console</h1>

        <Link to="/workbench" className="App-link">进入Workbench</Link>

      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* <Route path="/workbench0" element={<Workbench0 />} /> */}
          <Route path="/workbench" element={<Workbench />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
