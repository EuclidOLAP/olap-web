import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const CubeMetrics = () => {
    const [cubeGid, setCubeGid] = useState(0);
    // const [cube, setCube] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const cube_gid = queryParams.get('cubeGid');

        setCubeGid(cube_gid);

        const fetchCubeData = async () => {
            try {
                const cubes = await axios.get(`${config.metaServerBaseURL}/api/cubes`);
                // setCubes(cubes);
                console.log('cubes:', cubes);
            } catch (error) {
                console.error('Error fetching cube data:', error);
            }
        };

        if (cube_gid) {
            fetchCubeData();
        }
    }, [location.search]);

    return (
        <div>
            <h1>Cube指标 {cubeGid}</h1>
        </div>
    );
};

export default CubeMetrics;