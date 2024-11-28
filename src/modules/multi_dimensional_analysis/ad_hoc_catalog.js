import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import AddIcon from '@mui/icons-material/Add';
import QueryIcon from '@mui/icons-material/QueryBuilder';
import CubeIcon from '@mui/icons-material/ViewInAr';
import axios from 'axios';
import config from '../../config';

const AdHocCatalog = ({ createNewAdHocQuery }) => {
    const [cubes, setCubes] = useState([]);

    // 模拟数据
    const mockQueries = [
        { id: 1, cubeId: 1, name: 'Query 1 for Sales Cube' },
        { id: 2, cubeId: 1, name: 'Query 2 for Sales Cube' },
        { id: 3, cubeId: 2, name: 'Query A for Marketing Cube' },
        { id: 4, cubeId: 2, name: 'Query B for Marketing Cube' },
        { id: 5, cubeId: 2, name: 'Query C for Marketing Cube' },
        { id: 6, cubeId: 3, name: 'Query X for Inventory Cube' },
    ];

    // 动态加载 Cube 和模拟 Queries
    const loadCubes = async () => {
        try {
            const cubeResponse = await axios.get(`${config.metaServerBaseURL}/api/cubes`);
            const cubesData = cubeResponse.data.data;

            // 使用模拟数据替代 API 查询数据
            const cubesWithQueries = cubesData.map((cube) => ({
                ...cube,
                queries: mockQueries.filter((query) => query.cubeId === cube.gid).map((query) => query.name),
            }));

            setCubes(cubesWithQueries);
        } catch (error) {
            console.error('Error loading cubes:', error);
        }
    };

    useEffect(() => {
        loadCubes();
    }, []);

    const handleCreateQuery = (cubeId) => {
        createNewAdHocQuery({
            cube_id: cubeId,
            query_uuid: uuidv4(),
        });
    };

    return (
        <Box sx={{ padding: 4, maxWidth: '1200px', margin: '0 auto' }}>
            {/* <Typography variant="h4" gutterBottom align="center">
                AdHoc Catalog
            </Typography> */}
            <Grid container spacing={4}>
                {cubes.map((cube) => (
                    <Grid item xs={12} key={cube.gid}>
                        <Box>
                            {/* Cube Card */}
                            <Card
                                sx={{
                                    width: '100%',
                                    maxWidth: 800,
                                    margin: '0 auto',
                                    height: 160,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: 2,
                                    boxShadow: 3,
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <CubeIcon sx={{ fontSize: 40, marginRight: 2, color: 'primary.main' }} />
                                        <Typography variant="h6" component="div">
                                            {cube.name}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {cube.description || 'No description available'}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleCreateQuery(cube.gid)}
                                    >
                                        New Query
                                    </Button>
                                </CardActions>
                            </Card>

                            {/* Queries Table */}
                            <Box sx={{ marginTop: 2, maxWidth: 800, margin: '16px auto 0 auto' }}>
                                <TableContainer component={Paper}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Query Name</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }} align="right">
                                                    Description
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {cube.queries.length > 0 ? (
                                                cube.queries.map((query, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{query}</TableCell>
                                                        <TableCell align="right">
                                                            <QueryIcon />
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={2} align="center">
                                                        No queries available for this cube.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AdHocCatalog;
