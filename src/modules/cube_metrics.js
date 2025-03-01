import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Grid, TextField } from '@mui/material';
// import { Typography, Button, Grid,  } from '@mui/material';
import { useLocation } from 'react-router-dom';
import CubeOutline from '../components/cube-outline';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MetaApi from '../utils/meta-api';

const CubeMetrics = () => {
  const [cubeGid, setCubeGid] = useState(0);
  const [cubeName, setCubeName] = useState('nothing...');
  const [selectedNode, setSelectedNode] = useState(null);
  const [metrics, setMetrics] = useState([]); // 存储从 MetaApi 获取到的指标数据
  const [isCreatingMetric, setIsCreatingMetric] = useState(false); // 控制是否显示新建指标表单
  const [newMetric, setNewMetric] = useState({
    name: '',
    code: '',
    alias: '',
    description: '',
    exp: '',
  }); // 存储新指标的输入信息

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cube_gid = params.get('cubeGid');
    const cube_name = params.get('cubeName');
    setCubeGid(cube_gid);
    setCubeName(cube_name);

    async function fetchData() {
      const metrics = await MetaApi.load_cube_calculated_metrics(cube_gid);
      console.log('Cube Metrics -------------------------------------------------------------:', metrics);
      setMetrics(metrics); // 更新状态，存储获取到的指标数据
    }

    fetchData();

  }, [location.search]);

  const selectedOlapEntityNode = (node) => {
    setSelectedNode(node);
    console.log('Selected OLAP Entity Node:', node);
  };

  const create_new_metric = (node) => {
    console.log('Action 1 <create_new_metric> executed with:', node);
    if (node.type === 'dimension_role') {
      alert('Sorry, you cannot create a metric based on a dimension role.\n目前还不能在维度角色下直接创建指标。');
      return;
    }

    if (node.type === 'hierarchy_role') {

    } else if (node.type === 'member_role') {

    }

    // 切换状态，显示新建指标表单
    setIsCreatingMetric(true);
  };

  // 保存新指标
  const handleSave = async () => {

    if (selectedNode.type === 'dimension_role') {
      alert('Sorry, you cannot create a metric based on a dimension role.\n目前还不能在维度角色下直接创建指标。');
      // 隐藏新建指标表单
      setIsCreatingMetric(false);
      return;
    }

    const metric_obj = {
      name: newMetric.name,
      cubeGid: cubeGid,
      exp: newMetric.exp,
    };
    
    if (selectedNode.type === 'hierarchy_role') {
      const dim_role = selectedNode.olapEntity.dimensionRole;
      const hier = selectedNode.olapEntity.hierarchy;
      metric_obj.dimensionRoleGid = dim_role.gid;
      metric_obj.dimensionGid = dim_role.dimensionGid;
      metric_obj.hierarchyGid = hier.gid;
      metric_obj.mountPointGid = hier.gid;
      metric_obj.level = 0;
    } else if (selectedNode.type === 'member_role') {
      const dim_role = selectedNode.olapEntity.dimensionRole;
      const member = selectedNode.olapEntity.member;
      metric_obj.dimensionRoleGid = dim_role.gid;
      metric_obj.dimensionGid = dim_role.dimensionGid;
      metric_obj.hierarchyGid = member.hierarchyGid;
      metric_obj.mountPointGid = member.gid;
      metric_obj.level = member.level + 1;
    }

    try {
      // 调用 MetaApi 保存新指标
      const response = await MetaApi.save_calculated_metric(metric_obj);
      console.log('Saved new metric:', response);

      // 重新加载数据
      const metrics = await MetaApi.load_cube_calculated_metrics(cubeGid);
      setMetrics(metrics); // 更新状态，刷新表格数据

      // 隐藏新建指标表单
      setIsCreatingMetric(false);

      // 清空新指标输入
      setNewMetric({
        name: '',
        code: '',
        alias: '',
        description: '',
        exp: '',
      });
    } catch (error) {
      console.error('Error saving new metric:', error);
      alert('保存失败，请重试！');
    }
  };

  const handleCancel = () => {
    setIsCreatingMetric(false); // 隐藏新建指标表单
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMetric((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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

        <Box
          sx={{
            flex: 1,
            backgroundColor: '#e2f7e2',
            padding: '20px',
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
        >
          {selectedNode ? (
            <Paper sx={{ padding: 2, marginTop: 2 }}>
              <Typography variant="h6">Selected Entity Details</Typography>
              <Typography variant="h5"><strong>display:</strong> {selectedNode.display}</Typography>
              <Typography variant="body1"><strong>Type:</strong> {selectedNode.type}</Typography>
            </Paper>
          ) : (
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              No entity selected.
            </Typography>
          )}

          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item>
              {!isCreatingMetric && (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!selectedNode}
                  onClick={() => create_new_metric(selectedNode)}
                >
                  新建指标
                </Button>
              )}
            </Grid>
          </Grid>

          {/* 新建指标表单 */}
          {isCreatingMetric && (
            <Box sx={{ marginTop: 2 }}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                value={newMetric.name}
                onChange={handleInputChange}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Expression"
                name="exp"
                fullWidth
                value={newMetric.exp}
                onChange={handleInputChange}
                sx={{ marginBottom: 2 }}
              />

              <Box sx={{ marginTop: 2 }}>
                <Button onClick={handleCancel} color="secondary" sx={{ marginRight: 2 }}>
                  取消
                </Button>
                <Button onClick={handleSave} color="primary">
                  保存
                </Button>
              </Box>
            </Box>
          )}

          {/* Table displaying CalculatedMetric data */}
          {!isCreatingMetric && (
            <Paper sx={{ marginTop: 2 }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Code</TableCell>
                      <TableCell align="right">Alias</TableCell>
                      <TableCell align="right">Description</TableCell>
                      <TableCell align="right">Expression</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metrics.map((metric) => (
                      <TableRow key={metric.gid}>
                        <TableCell component="th" scope="row">
                          {metric.name}
                        </TableCell>
                        <TableCell align="right">{metric.code}</TableCell>
                        <TableCell align="right">{metric.alias}</TableCell>
                        <TableCell align="right">{metric.description}</TableCell>
                        <TableCell align="right">{metric.exp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CubeMetrics;
