/**
 * This is a generic component used to show the cube's outline (dimensions roles tree).
 */

import * as React from 'react';
import Box from '@mui/material/Box';
import { useEffect } from 'react';
// import { useEffect, useState } from 'react';

const CubeOutline = ({ cubeGid }) => {
  // // 设置状态，存储API响应的数据和加载状态
  // const [data, setData] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    // // 定义API请求的URL，假设使用cubeGid作为查询参数
    // const apiUrl = `/api/cube/${cubeGid}`;

    // 发起API请求
    const fetchData = async () => {
      // try {
      //   const response = await fetch(apiUrl);

      //   // 检查响应是否成功
      //   if (!response.ok) {
      //     throw new Error('Network response was not ok');
      //   }

      //   // 解析JSON数据并更新状态
      //   const result = await response.json();
      //   setData(result);
      // } catch (error) {
      //   // 捕获并设置错误状态
      //   setError(error);
      // } finally {
      //   // 更新加载状态
      //   setLoading(false);
      // }
    };

    // 调用fetchData函数
    fetchData();
  }, [cubeGid]); // 依赖数组中包含cubeGid，确保每次cubeGid变化时都重新发起请求

  // // 根据加载状态、数据状态和错误状态渲染不同的内容
  // if (loading) {
  //   return <Box sx={{ minHeight: 352, minWidth: 250 }}><h1>Loading...</h1></Box>;
  // }

  // if (error) {
  //   return <Box sx={{ minHeight: 352, minWidth: 250 }}><h1>Error: {error.message}</h1></Box>;
  // }

  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <h1>Cube Outline {cubeGid}</h1>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> 显示从API返回的内容 */}
    </Box>
  );
};

export default CubeOutline;
