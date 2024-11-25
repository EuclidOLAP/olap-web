import React, { useEffect } from 'react';

const AdHoc = () => {

    useEffect(() => {
        // 在新标签页打开 ad_hoc_tabs 组件对应的路径
        const newTab = window.open('/ad_hoc_tabs', '_blank');
        if (newTab) {
            // newTab.focus(); // 确保新标签页获取焦点
        }
    }, []); // 确保仅在组件挂载时运行一次

    return (
        <h1>___ AD_hoc ___</h1>
    );
};

export default AdHoc;