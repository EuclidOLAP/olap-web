import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
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

    const open_cube_metrics_page = async (cube) => {
        console.log(">>>>>>>>>> open_cube_metrics_page", cube);
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
                                <Button variant="contained" color="primary" onClick={() => open_cube_metrics_page(item.details)}>
                                    创建指标
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default CardComponent;
