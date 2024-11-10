import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import config from '../../config';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import Link from '@mui/material/Link';
import Members from './members';

export default function DataTable() {

    const columns = [
        { field: 'gid', headerName: 'gid', width: 200 },
        // { field: 'id', headerName: 'id', width: 120 },
        // { field: 'code', headerName: 'code', width: 80 },
        {
            field: 'name', headerName: 'name', width: 200,
            renderCell: (params) => (
                <Link
                    component="button"
                    variant="body2"
                    onClick={() => handleNameClick(params.row)}
                >
                    {params.value}
                </Link>
            )
        },
        // { field: 'alias', headerName: 'alias', width: 80 },
        // { field: 'display', headerName: 'display', width: 120 },
        { field: 'type', headerName: 'type', width: 240 },
        { field: 'createdAt', headerName: 'createdAt', width: 170 },
        { field: 'updatedAt', headerName: 'updatedAt', width: 170 },
        // { field: 'created_by', headerName: 'created_by', width: 120 },
        // { field: 'updated_by', headerName: 'updated_by', width: 120 },
        // { field: 'description', headerName: 'description', width: 300 },
        // { field: 'defaultHierarchyGid', headerName: 'defaultHierarchyGid', width: 120 },
    ];

    const [dimensions, setDimensions] = useState([]);
    const [open, setOpen] = useState(false);  // 控制 Dialog 显示状态
    const [dimensionName, setDimensionName] = useState('');  // 存储新维度名

    const [selectedDimensionName, setSelectedDimensionName] = useState('');  // 存储选中的维度Name
    const [selectedDimensionGid, setSelectedDimensionGid] = useState(null);  // 存储选中的维度gid
    const [dimensionNembersDialogOpen, setDimensionNembersDialogOpen] = useState(false);

    // 获取所有维度的函数
    const fetchDimensions = async () => {
        try {
            const response = await axios.get(`${config.metaServerBaseURL}/api/dimensions`); // 假设后端运行在该端口
            if (response.data.success) {
                let dim_arr = response.data.data;
                dim_arr.forEach(dim => {
                    dim.id = dim.gid;
                });
                console.log("::>", dim_arr);
                setDimensions(dim_arr);
            }
        } catch (error) {
            console.error('Error fetching dimensions:', error);
        }
    };

    // 初始化时加载维度数据
    useEffect(() => {
        fetchDimensions();

        // 手动移除滚动条元素的 aria-hidden 属性
        const removeAriaHidden = () => {
            const scrollbars = document.querySelectorAll('.MuiDataGrid-scrollbar');
            scrollbars.forEach(scrollbar => scrollbar.removeAttribute('aria-hidden'));
        };
        removeAriaHidden();

    }, []);

    // 打开 Dialog
    const handleClickOpen = () => {
        setOpen(true);
    };

    // 关闭 Dialog
    const handleClose = () => {
        setOpen(false);
        setDimensionName('');  // 清空输入框内容
    };

    // 处理 name 字段点击事件，设置 selectedGid 并打开 Dialog of Dimension Members
    const handleNameClick = (row) => {
        setSelectedDimensionGid(row.gid);
        setSelectedDimensionName(row.name);
        setDimensionNembersDialogOpen(true);
    };

    // 新建维度的提交操作
    const handleCreateDimension = async () => {
        try {
            const response = await axios.post(`${config.metaServerBaseURL}/api/dimension`, {
                name: dimensionName
            });
            console.log("::>--------------->", response.data);
            fetchDimensions();  // 重新获取数据以更新表格
            handleClose();  // 关闭 Dialog
        } catch (error) {
            console.error('Error creating dimension:', error);
        }
    };

    return (
        <Paper sx={{ height: '100vh', width: '100%', padding: 2 }}>
            {/* 新建维度按钮 */}
            <Box sx={{ marginBottom: 2, display: 'flex', justifyContent: 'flex-start' }}>
                <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={handleClickOpen}>
                    Create
                </Button>
                {/* <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    新建维度
                </Button> */}
            </Box>

            {/* DataGrid - 使用动态高度 */}
            <Box sx={{ height: 'calc(100vh - 150px)' }}>
                <DataGrid
                    rows={dimensions}
                    columns={columns}
                    sx={{ height: '100%', width: '100%' }}
                />
            </Box>

            {/* 新建维度的 Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="md"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        width: '30vw',  // 设置 Dialog 宽度为视口宽度的 30%
                        // height: '40vh',
                        maxWidth: 'none' // 禁用默认的 maxWidth 限制
                    }
                }}>
                <DialogTitle>Create a new dimension</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="dimension name"
                        type="text"
                        fullWidth
                        value={dimensionName}
                        onChange={(e) => setDimensionName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateDimension} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 维度成员的 Dialog */}
            <Dialog open={dimensionNembersDialogOpen} onClose={() => {
                setDimensionNembersDialogOpen(false);
                setSelectedDimensionGid(null);
            }} maxWidth="md" fullWidth sx={{
                '& .MuiDialog-paper': {
                    width: '60vw',       // 90% of viewport width
                    height: '90vh',      // 90% of viewport height
                    maxWidth: 'none',    // Disable maxWidth restriction
                }
            }}>
                <DialogTitle>Members of Dimension instence: {selectedDimensionName}</DialogTitle>
                <DialogContent>
                    <Members dimensionGid={selectedDimensionGid} />
                </DialogContent>
            </Dialog>
        </Paper>
    );
}
