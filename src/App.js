import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

import Workbench from './pages/Workbench';
import AdHocTabs from './modules/multi_dimensional_analysis/ad_hoc_tabs';
import CubeMetrics from './modules/cube_metrics';

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

          <Route path="/ad_hoc_tabs" element={<AdHocTabs />} />

          <Route path="/cube_metrics" element={<CubeMetrics />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
