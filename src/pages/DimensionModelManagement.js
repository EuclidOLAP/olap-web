import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 引入 axios 库
import { List, ListItem, ListItemText } from '@mui/material';
import config from '../config';  // 导入配置文件

const DimensionModelManagement = () => {

  const [dimensionName, setDimensionName] = useState('');

  const [dimensions, setDimensions] = useState([]);  // 用于存储维度数据

  const handleDimensionNameChange = (event) => {
    setDimensionName(event.target.value);
  };

  // 获取所有维度的函数
  const fetchDimensions = async () => {
    try {
      const response = await axios.get(`${config.metaServerBaseURL}/api/dimensions`); // 假设后端运行在该端口
      if (response.data.success) {
        setDimensions(response.data.data);  // 更新维度列表
      }
    } catch (error) {
      console.error('Error fetching dimensions:', error);
    }
  };

  // 初始化时加载维度数据
  useEffect(() => {
    fetchDimensions();
  }, []);

  const createDimensionButtonSubmit = async () => {
    console.log(">>>>>>>>>>>>>>>>++++++ Submitted value: ", dimensionName);
    try {
      // 调用 meta-server 的 API
      const response = await axios.post(`${config.metaServerBaseURL}/api/dimension`, {
        name: dimensionName
      });
      console.log('Dimension created:', response.data);

      // 这里你可以做更多的事情，比如显示一个成功信息或清空表单
      fetchDimensions(); // 刷新维度列表

    } catch (error) {
      console.error('Error creating dimension:', error);
    }
  };

  return (
    <div>
      <h1>Dimension Model Management</h1>

      <div>
        <p>Create Dimension</p>
        <input type="text" value={dimensionName} onChange={handleDimensionNameChange} placeholder="type dimension name here" />
        <br />
        <button onClick={createDimensionButtonSubmit}>create a new dimension</button>
      </div>

      <div>
        {/* 维度列表 */}
        <List>
          {dimensions.map((dimension) => (
            <ListItem key={dimension.gid}>
              <ListItemText primary={dimension.name} />
            </ListItem>
          ))}
        </List>
      </div>

    </div>
  );
};

export default DimensionModelManagement;
