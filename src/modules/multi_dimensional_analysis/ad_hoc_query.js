import React, { useState } from 'react';

const AdHocQuery = ({ data }) => {
    const [queryId, setQueryId] = useState(data.queryId); // 用于管理 Query ID 的状态

    const handleInputChange = (e) => {
        setQueryId(e.target.value); // 更新 Query ID 的状态
    };

    const handleApplyChange = () => {
        alert(`Query ID 已更新为: ${queryId}`); // 提示用户 Query ID 已更新
    };

    return (
        <div>
            <h1>Ad Hoc Query Component</h1>
            <p>Query ID: {queryId}</p>
            <div>
                <input
                    type="number"
                    value={queryId}
                    onChange={handleInputChange}
                    style={{ marginRight: '10px', padding: '5px' }}
                />
                <button onClick={handleApplyChange} style={{ padding: '5px 10px' }}>
                    应用修改
                </button>
            </div>
        </div>
    );
};

export default AdHocQuery;
