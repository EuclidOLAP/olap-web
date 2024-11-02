import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

import Workbench0 from './pages/Workbench0';
import Workbench from './pages/Workbench';

import Reports from './pages/Reports';
import DataAnalysis from './pages/DataAnalysis';
import ImportExport from './pages/ImportExport';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';

import DimensionModelManagement from './pages/DimensionModelManagement';

import Button from '@mui/material/Button';

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

      <h1>功能菜单一级选项</h1>
      <button onClick={() => openInNewTab('/dimension-model-management')}>【维度模型管理】</button>
      <Button variant="contained" color="primary"
        onClick={() => openInNewTab('/dimension-model-management')}>
          &gt;&gt;&gt; Dimension Model Management &lt;&lt;&lt;
      </Button>
      <button onClick={() => openInNewTab('/XXXXXXXXXXXX')}>功能菜单二级选项</button>
      <button onClick={() => openInNewTab('/XXXXXXXXXXXX')}>功能菜单二级选项</button>

      <h1>功能菜单一级选项</h1>
      <button onClick={() => openInNewTab('/XXXXXXXXXXXX')}>功能菜单二级选项</button>
      <button onClick={() => openInNewTab('/XXXXXXXXXXXX')}>功能菜单二级选项</button>
      <button onClick={() => openInNewTab('/XXXXXXXXXXXX')}>功能菜单二级选项</button>

      <h1>功能菜单一级选项</h1>
      <button onClick={() => openInNewTab('/XXXXXXXXXXXX')}>功能菜单二级选项</button>
      <button onClick={() => openInNewTab('/XXXXXXXXXXXX')}>功能菜单二级选项</button>
      <button onClick={() => openInNewTab('/XXXXXXXXXXXX')}>功能菜单二级选项</button>

      <h1>功能菜单一级选项 MUI Button</h1>
      <Button variant="contained" color="primary">MUI Button 1</Button>
      <Button color="primary">MUI Button 2</Button>
      <Button variant="contained">MUI Button 3</Button>
      <Button>MUI Button 4</Button>



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
        {/* <h3>EuclidOLAP is a data analysis system with unparalleled multidimensional analysis capabilities.</h3> */}
        {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> */}
        {/* <a
          className="App-link"
          href="http://www.euclidolap.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.euclidolap.com
        </a> */}

        <Link to="/workbench0" className="App-link">进入Workbench 0</Link>
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

          <Route path="/workbench0" element={<Workbench0 />} />
          <Route path="/workbench" element={<Workbench />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/data-analysis" element={<DataAnalysis />} />
          <Route path="/import-export" element={<ImportExport />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="/dimension-model-management" element={<DimensionModelManagement />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
