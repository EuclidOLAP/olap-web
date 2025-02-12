import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import axios from 'axios';
import config from '../config';

const transformCubes = (cubes) => {
    return cubes.map((cube, index) => ({
        id: index + 1,
        title: cube.name,
        description: 'This is a description of the cube.',
        icon: <ViewInArIcon sx={{ fontSize: 80 }} />,
        details: cube // 额外存储 cube 的原始信息
    }));
};

const CardComponent = () => {
    const [cubeCards, setCubeCards] = useState([]);
    const [selectedCube, setSelectedCube] = useState(null); // 选中的 Cube 信息
    const [selectedCubeCapacity, setSelectedCubeCapacity] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false); // 控制 Dialog 显示状态
    const [inputValues, setInputValues] = useState({
        measurementSize: '',
        // param1: '',
        // param2: ''
    });

    useEffect(() => {
        const fetch_cubes = async () => {
            try {
                const response = await axios.get(`${config.metaServerBaseURL}/api/cubes`);
                const cubes = response.data.data;
                setCubeCards(transformCubes(cubes));
            } catch (error) {
                console.error('Error fetching cubes:', error);
            }
        };
        fetch_cubes();
    }, []);

    // 处理按钮点击，打开 Dialog
    const handleOpenDialog = async (cube) => {
        const cube_capacity = await axios.get(`${config.metaServerBaseURL}/api/cube/${cube.gid}/capacity`);
        setSelectedCubeCapacity(cube_capacity.data.capacity);
        setSelectedCube(cube);
        setDialogOpen(true);
    };

    // 关闭 Dialog
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    // 处理输入框变化
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputValues((prev) => ({ ...prev, [name]: value }));
    };

    // 处理执行任务按钮点击
    const handleExecuteTask = async () => {
        if (!selectedCube || !inputValues.measurementSize) {
            console.error("缺少必要参数");
            return;
        }
    
        const cubeGid = parseInt(selectedCube.gid, 10);
        const expectedMeasureRecords = parseInt(inputValues.measurementSize, 10);
    
        if (isNaN(cubeGid) || isNaN(expectedMeasureRecords)) {
            console.error("参数转换失败");
            return;
        }
    
        try {
            const response = await axios.post(`${config.metaServerBaseURL}/api/cube/${cubeGid}/generate-measures`, { expectedMeasureRecords });
            console.log("数据生成任务提交成功:", response.data);
        } catch (error) {
            console.error("数据生成任务提交失败:", error);
        }
    
        handleCloseDialog();
    };

    return (
        <>
            {/* 立方体卡片网格 */}
            <Grid container spacing={2} justifyContent="center" sx={{ padding: '20px' }}>
                {cubeCards.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card sx={{ textAlign: 'center', padding: 2 }}>
                            <CardContent>
                                {item.icon}
                                <Typography variant="h6" gutterBottom>
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" paragraph>
                                    {item.description}
                                </Typography>
                                <Button variant="contained" color="primary" onClick={() => handleOpenDialog(item.details)}>
                                    生成度量数据
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* 立方体详情弹出框 */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md">
                <DialogTitle>生成度量数据</DialogTitle>
                <DialogContent>
                    {selectedCube && (
                        <>
                            <Typography variant="h6" gutterBottom>
                                立方体名称: {selectedCube.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" paragraph>
                                GID: {selectedCube.gid}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" paragraph>
                                Cube Capacity: {selectedCubeCapacity}
                            </Typography>

                            {/* 输入参数 */}
                            <TextField
                                label="预期数据量"
                                name="measurementSize"
                                value={inputValues.measurementSize}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            {/* <TextField
                                label="参数2"
                                name="param2"
                                value={inputValues.param2}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            /> */}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        取消
                    </Button>
                    <Button onClick={handleExecuteTask} variant="contained" color="primary">
                        执行数据生成任务
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CardComponent;
