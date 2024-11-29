import React, { useState } from 'react';

export default function UploadMeta() {
    // 状态存储 textarea 的内容
    const [text, setText] = useState("");

    const inputDimension = () => {
        console.log('inputDimension');
    };

    const buildCube = () => {
        console.log('buildCube');
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>导入模型</h1>

            {/* 文本区域 */}
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows="10"
                cols="50"
                placeholder="请输入文本..."
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />

            {/* 横向排列的按钮 */}
            <div style={{ justifyContent: 'space-between' }}>
                <button onClick={() => inputDimension()}>Input Dimension</button>
                <button onClick={() => buildCube()}>Build Cube</button>
            </div>
        </div>
    );
}
