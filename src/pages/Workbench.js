import React, { useState } from 'react';
// import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Header from '../components/Header';
import Icon from '@mui/icons-material/Category';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { styled } from '@mui/material/styles';

const CustomListItem = styled(ListItem)(({ theme, selected }) => ({
  backgroundColor: selected ? theme.palette.primary.light : 'inherit',
  color: selected ? 'white' : 'inherit',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
}));

function Workbench() {

  // 定义一级功能选项和对应的二级功能内容
  const features = [
    {
      id: 'model_management',
      name: '模型管理',
      icon: <Icon />,
      subFeatures: [
        { name: '维度管理', description: '维度管理的描述。', route: '/dimension-model-management' },
        { name: '二级功能1-2', description: '这是二级功能2的描述。', route: '/RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR_11' },
      ],
    },
    {
      id: 'feature2',
      name: '一级功能2',
      icon: <Icon />,
      subFeatures: [
        { name: '二级功能2-1', description: '这是二级功能1的描述。', route: '/RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR_21' },
        { name: '二级功能2-2', description: '这是二级功能2的描述。', route: '/RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR_22' },
      ],
    },
    {
      id: 'feature3',
      name: '一级功能3',
      icon: <Icon />,
      subFeatures: [
        { name: '二级功能3-1', description: '这是二级功能1的描述。', route: '/RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR_31' },
        { name: '二级功能3-2', description: '这是二级功能2的描述。', route: '/RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR_32' },
      ],
    },
  ];

  // 使用 useState 保存选中的一级功能
  const [selectedFeature, setSelectedFeature] = useState(null);

  // 打开新标签页的函数
  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box display="flex" flex="1" overflow="auto">

        {/* left Box */}
        <Box width="270px" maxWidth="320px" bgcolor="#f0f0f0">
          <List>
            {features.map((feature) => (
              <CustomListItem
                // button 
                key={feature.id}
                onClick={() => setSelectedFeature(feature)}
                selected={selectedFeature && selectedFeature.id === feature.id}
              // selected={true}
              >
                <ListItemIcon>{feature.icon}</ListItemIcon>
                <ListItemText primary={feature.name} />
              </CustomListItem>
            ))}
          </List>
        </Box>

        {/* right Box */}
        <Box flexGrow={1}>
          {selectedFeature ? (
            <Box>
              <Box fontWeight="bold" fontSize="20px" marginBottom="16px">
                &gt;&gt;&gt; {selectedFeature.name} &lt;&lt;&lt;
              </Box>
              <Box display="flex" flexDirection="column" gap="16px">
                {selectedFeature.subFeatures.map((subFeature, index) => (
                  <Box
                    key={index}
                    padding="16px"
                    border="1px solid #ddd"
                    borderRadius="8px"
                    bgcolor="#fafafa"
                    // onClick={() => openInNewTab('/dimension-model-management')}
                    onClick={() => openInNewTab(subFeature.route)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Box display="flex" alignItems="center" marginBottom="8px">
                      <Box marginRight="8px" color="primary.main"><Icon /></Box>
                      <Box fontWeight="bold">{subFeature.name}</Box>
                    </Box>
                    <Box color="text.secondary">{subFeature.description}</Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <h1>请选择一级功能</h1>
          )}

        </Box>
      </Box>
    </Box>
  );
}

export default Workbench;