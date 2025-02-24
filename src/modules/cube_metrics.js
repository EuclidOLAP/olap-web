import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import CubeOutline from '../components/cube-outline';

const CubeMetrics = () => {
  const [cubeGid, setCubeGid] = useState(0);
  const [cubeName, setCubeName] = useState('nothing...');

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cube_gid = params.get('cubeGid');
    const cube_name = params.get('cubeName');
    setCubeGid(cube_gid);
    setCubeName(cube_name);
  }, [location.search]);

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
            overflowY: 'auto', // Allow scrolling if content is large
          }}
        >
          <CubeOutline cubeGid={cubeGid} />
        </Box>

        {/* Right section occupies remaining space */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#e2f7e2', // Light green color for right section
            padding: '20px',
            boxSizing: 'border-box',
          }}
        >
          <Typography variant="h6">Right Section</Typography>
          <Typography variant="body1">This is the right section which takes up the remaining space.</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CubeMetrics;
