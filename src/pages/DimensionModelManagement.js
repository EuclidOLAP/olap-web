import React, { useState } from 'react';
import axios from 'axios'; // 引入 axios 库

const DimensionModelManagement = () => {

  const [dimensionName, setDimensionName] = useState('');

  const handleDimensionNameChange = (event) => {
    setDimensionName(event.target.value);
  };

  const createDimensionButtonSubmit = async () => {
    console.log(">>>>>>>>>>>>>>>>++++++ Submitted value: ", dimensionName);
    try {
      // 调用 meta-server 的 API
      const response = await axios.post('http://dev.vm:8763/api/dimension', {
        name: dimensionName
      });
      console.log('Dimension created:', response.data);
      // 这里你可以做更多的事情，比如显示一个成功信息或清空表单
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

    </div>
  );
};

export default DimensionModelManagement;
