import React, { useState } from 'react';
import axios from 'axios';
import config from '../../config';

export default function UploadMeta() {
    // 状态存储 textarea 的内容
    const [text, setText] = useState("");

    const inputDimension = async () => {
        console.log('>>>>>>>>>>>>>>>>>>>>> inputDimension >>>>>>>>>>>>>>>>>>>>>');

        let lines = text.trim().split('\n').map(line => line.trim());

        const dimension = lines[0];
        console.log("dimension: " + dimension);

        const levels = lines[1].split('\t');
        console.log("levels: " + levels);

        lines = lines.slice(2);
        for (let member_path of lines) {
            member_path = member_path.split('\t');
            console.log("member_path: " + member_path);
        }

        const response = await axios.post(`${config.metaServerBaseURL}/api/dimension`, {
            name: dimension,
            defaultHierarchyName: dimension,
            levels: levels
        });

        console.log("XXX new dim XXX", response);

    };

    const buildCube = () => {
        console.log('>>>>>>>>>>>>>>>>>>>>> buildCube >>>>>>>>>>>>>>>>>>>>>');
        console.log(text);
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
