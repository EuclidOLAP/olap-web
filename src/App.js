import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

// 工作台页面组件
function Dashboard() {
  return (
    <div>
      <h1>工作台页面</h1>
      <p>欢迎进入olap web工作台！</p>
    </div>
  );
}

// 首页组件
function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>EuclidOLAP Web Console</h1>
        <h3>EuclidOLAP is a data analysis system with unparalleled multidimensional analysis capabilities.</h3>
        {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> */}
        <a
          className="App-link"
          href="http://www.euclidolap.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.euclidolap.com
        </a>
      </header>
      <Link to="/dashboard">
        <button>进入系统</button>
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
