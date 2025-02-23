import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

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
                <h2>{cubeName}</h2>
                <p>{cubeGid}</p>
            </Box>

            <Box sx={{ display: 'flex', flex: 1 }}>
                {/* Left section with width 460px */}
                <Box
                    sx={{
                        width: '460px',
                        backgroundColor: '#cce7ff', // Light blue color for left section
                        padding: '20px',
                        boxSizing: 'border-box',
                    }}
                >
                    <h3>Left Section</h3>
                    <p>This is the left section with a fixed width of 460px.</p>
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
                    <h3>Right Section</h3>
                    <p>This is the right section which takes up the remaining space.</p>
                </Box>
            </Box>
        </Box>
    );
};

export default CubeMetrics;
