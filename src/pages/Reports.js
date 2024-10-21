import React, { useEffect, useState } from 'react';
import axios from 'axios';  // 如果您使用 fetch，可以忽略这一行

function Reports() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 使用 useEffect 在组件加载时调用 API
  useEffect(() => {
    // 通过 axios 调用 API
    axios.get('http://dev.vm:8763/api/data')
      .then(response => {
        setData(response.data.data);  // 更新数据状态
        setLoading(false);            // 设置加载状态为 false
      })
      .catch(error => {
        setError(error.message);      // 捕获错误
        setLoading(false);
      });
  }, []);

  if (loading) return <p>加载中...</p>;
  if (error) return <p>出现错误: {error}</p>;

  return (
    <div>
      <h1>工作台页面</h1>
      <h2>从 API 获取的数据：</h2>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.name}: {item.value}</li>
        ))}
      </ul>
    </div>
  );
}

export default Reports;