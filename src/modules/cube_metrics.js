import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';
import CubeOutline from '../components/cube-outline';

// import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

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
    setSelectedNode(node);
    console.log('Selected OLAP Entity Node:', node);
  };

  // 示例操作函数：这些函数会接收选中的节点对象并输出它们
  const handleAction1 = (node) => {
    console.log('Action 1 executed with:', node);
  };

  const handleAction2 = (node) => {
    console.log('Action 2 executed with:', node);
  };

  const handleAction3 = (node) => {
    console.log('Action 3 executed with:', node);
  };

  const handleAction4 = (node) => {
    console.log('Action 4 executed with:', node);
  };

  const handleAction5 = (node) => {
    console.log('Action 5 executed with:', node);
  };

  const handleAction6 = (node) => {
    console.log('Action 6 executed with:', node);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top section with fixed height of 120px */}
      <Box
        sx={{
          height: '120px',
          backgroundColor: '#f0f0f0',
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
            backgroundColor: '#cce7ff',
            padding: '20px',
            boxSizing: 'border-box',
            height: `calc(100vh - 120px)`,
            overflowY: 'auto',
          }}
        >
          <CubeOutline cubeGid={cubeGid} callback_selected_node={selectedOlapEntityNode} />
        </Box>

        {/* Right section occupies remaining space */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#e2f7e2',
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
              {/* Additional attributes can be displayed here */}
            </Paper>
          ) : (
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              No entity selected.
            </Typography>
          )}

          {/* Buttons for various actions */}
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                disabled={!selectedNode}
                onClick={() => handleAction1(selectedNode)}
              >
                Action 1
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                disabled={!selectedNode}
                onClick={() => handleAction2(selectedNode)}
              >
                Action 2
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                disabled={!selectedNode}
                onClick={() => handleAction3(selectedNode)}
              >
                Action 3
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                disabled={!selectedNode}
                onClick={() => handleAction4(selectedNode)}
              >
                Action 4
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                disabled={!selectedNode}
                onClick={() => handleAction5(selectedNode)}
              >
                Action 5
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                disabled={!selectedNode}
                onClick={() => handleAction6(selectedNode)}
              >
                Action 6
              </Button>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Dessert (100g serving)</TableCell>
                  <TableCell align="right">Calories</TableCell>
                  <TableCell align="right">Fat&nbsp;(g)</TableCell>
                  <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                  <TableCell align="right">Protein&nbsp;(g)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </Box>
      </Box>
    </Box>
  );
};

export default CubeMetrics;
