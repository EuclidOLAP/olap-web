import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import RowingIcon from '@mui/icons-material/Rowing';
import ColumnIcon from '@mui/icons-material/ViewColumn';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import config from '../../config';

const ArrayTable = ({ data, rowHeaders, columnHeaders }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {/* 空白单元格，用于对齐行标题和列标题 */}
                        <TableCell sx={{ backgroundColor: '#f0f0f0' }} />
                        {/* 渲染列标题，添加图标 */}
                        {columnHeaders.map((colHeader, colIndex) => (
                            <TableCell
                                key={`col-header-${colIndex}`}
                                align="center"
                                sx={{
                                    backgroundColor: '#f0f0f0',
                                    fontWeight: 'bold',
                                    color: '#333',
                                    fontSize: '1rem'
                                }}
                            >
                                <ColumnIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                {colHeader}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, rowIndex) => (
                        <TableRow key={`row-${rowIndex}`}>
                            {/* 渲染行标题，添加图标 */}
                            <TableCell
                                align="center"
                                component="th"
                                scope="row"
                                sx={{
                                    backgroundColor: '#f0f0f0',
                                    fontWeight: 'bold',
                                    color: '#333',
                                    fontSize: '1rem'
                                }}
                            >
                                <RowingIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                {rowHeaders[rowIndex]}
                            </TableCell>
                            {/* 渲染数据单元格 */}
                            {row.map((cell, colIndex) => (
                                <TableCell key={`cell-${rowIndex}-${colIndex}`} align="center">
                                    {cell}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const CubeDimensionMatrix = () => {
    const [data, setData] = useState([
        [1, 2, 3],
        [4, 5, 6],
        [7, '>>>s<<<', ""],
    ]);
    const [rowHeaders, setRowHeaders] = useState(['Row 1', 'Row 2', 'Row 3']);
    const [columnHeaders, setColumnHeaders] = useState(['Col 1', 'Col 2', 'Col 3']);
    const [openCreateCubeDialog, setOpenCreateCubeDialog] = useState(false);
    const [cubeName, setCubeName] = useState('');
    const [dimensionValues, setDimensionValues] = useState({});
    const [dimensions, setDimensions] = useState([]);
    const [measures, setMeasures] = useState('');

    const load_data = async () => {
        let _dimensions = await axios.get(`${config.metaServerBaseURL}/api/dimensions`);
        _dimensions = _dimensions.data.data;
        _dimensions = _dimensions.filter((d) => d.type === 'NOT_MEASURE_DIMENSION')

        setDimensions(_dimensions);

        let _cubes = await axios.get(`${config.metaServerBaseURL}/api/cubes`);
        _cubes = _cubes.data.data;

        let _dimensionRoles = await axios.get(`${config.metaServerBaseURL}/api/dimensionRoles`);
        _dimensionRoles = _dimensionRoles.data.data;

        console.log("dimensions:", _dimensions);
        console.log("cubes:", _cubes);
        console.log("dimensionRoles:", _dimensionRoles);

        let roles_mapping = {};
        for (const dimensionRole of _dimensionRoles) {
            let key = dimensionRole.cubeGid + '_' + dimensionRole.dimensionGid;
            if (roles_mapping[key]) {
                roles_mapping[key] += 1;
            } else {
                roles_mapping[key] = 1;
            }
        }

        // console.log("roles_mapping:", roles_mapping);

        const _data = [];
        for (const cube of _cubes) {
            const _row = [];
            for (const dimension of _dimensions) {
                const key = cube.gid + '_' + dimension.gid;
                if (roles_mapping[key]) {
                    _row.push(roles_mapping[key]);
                } else {
                    _row.push('');
                }
            }
            _data.push(_row);
        }

        setData(_data);
        setRowHeaders(_cubes.map((cube) => cube.name));
        setColumnHeaders(_dimensions.filter((d) => d.type === 'NOT_MEASURE_DIMENSION').map((dimension) => dimension.name));
    };

    useEffect(() => {
        load_data();
    }, []);

    const buildCube = () => {
        console.log("build a new cube");
        setOpenCreateCubeDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenCreateCubeDialog(false);
        setCubeName('');
        setDimensionValues({});
    };

    const handleDimensionValueChange = (dimensionGid, value) => {
        setDimensionValues((prevValues) => ({
            ...prevValues,
            [dimensionGid]: value
        }));
    };

    const handleCreateCube = async () => {
        // Process the comma-separated values for Measures and Dimensions
        const cube_suit = {
            cubeName,
            measures: measures.split(',').map((measure) => measure.trim()), // Split measures by comma
            dimensionRoles: Object.entries(dimensionValues).map(([id, value]) => ({
                dimensionGid: id,
                roles: value.split(',').map((dimensionRole) => dimensionRole.trim()) // Split dimension values by comma
            }))
        };
        console.log("create cube data:", cube_suit);
        try {
            const response = await axios.post(`${config.metaServerBaseURL}/api/cube`, cube_suit);
            console.log("response of cube created:", response);
            handleCloseDialog();
            load_data();
        } catch (error) {
            console.error("Error creating cube:", error);
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Box sx={{ marginBottom: 1, display: 'flex', justifyContent: 'flex-start' }}>
                <h2>Cube Dimension Matrix</h2>
            </Box>
            <Box sx={{ marginBottom: 1, display: 'flex', justifyContent: 'flex-start' }}>
                <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={buildCube}>
                    Build a new cube
                </Button>
            </Box>
            <Box sx={{ marginBottom: 1, display: 'flex', justifyContent: 'flex-start' }}>
                <ArrayTable data={data} rowHeaders={rowHeaders} columnHeaders={columnHeaders} />
            </Box>

            {/* Dialog */}
            <Dialog 
                open={openCreateCubeDialog} 
                onClose={handleCloseDialog} 
                fullWidth 
                maxWidth="md"
                sx={{
                    '& .MuiDialog-paper': {
                        width: '80vw', // 设置Dialog宽度为视口宽度的80%
                        maxWidth: '1200px', // 设置最大宽度为1200px
                    }
                }}
            >
                <DialogTitle>Build a New Cube</DialogTitle>
                <DialogContent>

                    {/* Cube Name Input */}
                    <h4>Cube Name</h4>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Cube Name"
                        fullWidth
                        value={cubeName}
                        onChange={(e) => setCubeName(e.target.value)}
                    />

                    <h4>Basic Metrics</h4>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Measures"
                        fullWidth
                        value={measures}
                        onChange={(e) => setMeasures(e.target.value)}
                    />
                    
                    <Box sx={{ marginTop: 2, marginBottom: 1 }}>
                        <h4>Dimensions and Roles</h4>
                        {dimensions.map((dimension) => (
                            <Box 
                                key={dimension.gid} 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between', 
                                    marginBottom: 2 
                                }}
                            >
                                <span style={{ fontWeight: 'bold', width: '30%' }}>{dimension.name}</span>
                                <TextField
                                    label="Metric"
                                    value={dimensionValues[dimension.gid] || ''}
                                    onChange={(e) => handleDimensionValueChange(dimension.gid, e.target.value)}
                                    fullWidth
                                    sx={{ marginLeft: 2, width: '65%' }}
                                />
                            </Box>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateCube} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CubeDimensionMatrix;
