import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import AdHocQuery from './ad_hoc_query';
import Typography from '@mui/material/Typography';
import AdHocCatalog from './ad_hoc_catalog';

export default function ScrollableTabsButtonAuto() {

    const [tabs, setTabs] = useState([
        {
            id: 1,
            key: "ADHOC_CATALOG",
            label: 'Catalog',
            datadata: { queryId: 1 }
        }
    ]);

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleAddTab = ({ cube_id, query_uuid }) => {
        const newId = tabs.length + 1;
        const newTab = {
            id: newId,
            label: `new query ${query_uuid.substring(0, 4)}`,
            data: { queryId: newId }, // 传入不同的数据
            cube_id,
            query_uuid
        };
        setTabs((prevTabs) => [...prevTabs, newTab]);
        setValue(tabs.length); // 设置为新建 Tab 的索引
    };

    const handleCloseTab = (index) => {
        setTabs((prevTabs) => {
            const newTabs = [...prevTabs];
            newTabs.splice(index, 1);
            return newTabs;
        });
        // 如果关闭的是当前选中的 Tab，切换到另一个 Tab
        setValue((prevValue) => (index === prevValue ? Math.max(0, index - 1) : prevValue));
    };

    return (
        <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
            {/* <Button variant="contained" onClick={handleAddTab} sx={{ mb: 2 }}>
                new
            </Button> */}
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
            >
                {tabs.map((tab, index) => (
                    <Tab
                        key={tab.id}
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {tab.label}
                                <span
                                    style={{
                                        marginLeft: '8px',
                                        cursor: 'pointer',
                                        color: 'blue',
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation(); // 防止触发切换 Tab 的事件
                                        handleCloseTab(index);
                                    }}
                                >
                                    <Typography sx={{ color: 'gray' }}> [x] </Typography>
                                </span>
                            </Box>
                        }
                    />
                ))}
            </Tabs>
            {tabs.map((tab, index) => (
                <Box
                    key={tab.id}
                    sx={{
                        mt: 2,
                        display: value === index ? 'block' : 'none', // 只显示选中的 Box
                    }}
                >
                    {
                        tab.key === 'ADHOC_CATALOG'
                            ? (<AdHocCatalog createNewAdHocQuery={handleAddTab} />)
                            : (<AdHocQuery data={{ cube_id: tab.cube_id, query_uuid: tab.query_uuid }} />)
                    }
                </Box>
            ))}
        </Box>
    );
}
