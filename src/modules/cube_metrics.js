import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useLocation } from 'react-router-dom';
import CubeOutline from '../components/cube-outline';

const CubeMetrics = () => {
  const [cubeGid, setCubeGid] = useState(0);
  const [cubeName, setCubeName] = useState('nothing...');
  const [selectedNode, setSelectedNode] = useState(null);  // 用于存储选中的实体对象

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cube_gid = params.get('cubeGid');
    const cube_name = params.get('cubeName');
    setCubeGid(cube_gid);
    setCubeName(cube_name);
  }, [location.search]);

  const selectedOlapEntityNode = (node) => {
    setSelectedNode(node);  // 更新选中的实体对象
    console.log("------------------------------>>>>>>>>> olapEntity Nodeeeeeeeee:", node);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top section with fixed height of 120px */}
      <Box
        sx={{
          height: '120px',
          backgroundColor: '#f0f0f0', // Light grey color for top section
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        <Typography variant="h4">{cubeName}</Typography>
        <Typography variant="body1">Cube GID: {cubeGid}</Typography>
      </Box>

      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Left section with width 460px for CubeOutline */}
        <Box
          sx={{
            width: '460px',
            backgroundColor: '#cce7ff', // Light blue color for left section
            padding: '20px',
            boxSizing: 'border-box',
            height: `calc(100vh - 120px)`, // Subtract the height of the top section (120px)
            overflowY: 'auto', // Allow scrolling if content exceeds the box height
          }}
        >
          <CubeOutline cubeGid={cubeGid} callback_selected_node={selectedOlapEntityNode} />
        </Box>

        {/* Right section occupies remaining space */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#e2f7e2', // Light green color for right section
            padding: '20px',
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
        >
          {/* Display the selected entity's details */}
          {selectedNode ? (
            <Paper sx={{ padding: 2, marginTop: 2 }}>
              <Typography variant="h6">Selected Entity Details</Typography>
              <Typography variant="h5"><strong>display:</strong> {selectedNode.display}</Typography>
              <Typography variant="body1"><strong>Type:</strong> {selectedNode.type}</Typography>
              {/* 你可以根据实体的不同属性，继续渲染更多详细信息 */}
            </Paper>
          ) : (
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              No entity selected.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CubeMetrics;
