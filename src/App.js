import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Reports from './pages/Reports';
import DataAnalysis from './pages/DataAnalysis';
import ImportExport from './pages/ImportExport';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';

// 工作台页面组件
function Dashboard() {
  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <h1>工作台页面</h1>
      <p>请选择一个功能：</p>
      <button onClick={() => openInNewTab('/reports')}>查看报告</button>
      <button onClick={() => openInNewTab('/data-analysis')}>数据分析</button>
      <button onClick={() => openInNewTab('/import-export')}>导入/导出</button>
      <button onClick={() => openInNewTab('/user-management')}>用户管理</button>
      <button onClick={() => openInNewTab('/settings')}>设置</button>
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
        <Link to="/dashboard">
          {/* <button>进入系统</button> */}
          <a href='/dashboard'>进入系统</a>
        </Link>
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/data-analysis" element={<DataAnalysis />} />
          <Route path="/import-export" element={<ImportExport />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
