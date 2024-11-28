import React, { useState, useEffect } from 'react';
import Fns from '../../functions/fns';
import { Box } from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Brightness1TwoToneIcon from '@mui/icons-material/Brightness1TwoTone';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import DehazeIcon from '@mui/icons-material/Dehaze';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';

const multiDimResults = [
    ['A1', 'B2', 'C3', 'D4', 'E5', 'F6', 'G7', 'H8', 'I9', 'J10'],
    ['K11', 'L12', 'M13', 'N14', 'O15', 'P16', 'Q17', 'R18', 'S19', 'T20'],
    ['U21', 'V22', 'W23', 'X24', 'Y25', 'Z26', 'A27', 'B28', 'C29', 'D30'],
    ['S71', 'T72', 'U73', 'V74', 'W75', 'X76', 'Y77', 'Z78', 'A79', 'B80'],
    ['C81', 'D82', 'E83', 'F84', 'G85', 'H86', 'I87', 'J88', 'K89', 'L90'],
    ['M91', 'N92', 'O93', 'P94', 'Q95', 'R96', 'S97', 'T98', 'U99', 'V100']
];

const DRAGGABLE_NODE_TYPE = 'DRAGGABLE_NODE_TYPE';

const AdHocQuery = ({ data }) => {

    const [queryUuid, setQueryUuid] = useState(data.query_uuid);
    const [cube, setCube] = useState(null);
    const [cubeStructTree, setCubeStructTree] = useState([]);

    const DraggableTreeNode = ({ element, icon }) => {

        const [, drag] = useDrag(() => ({
            type: DRAGGABLE_NODE_TYPE,
            item: element,
        }));

        return (
            <Box ref={drag} sx={{ flex: 1, display: 'flex' }}>
                {/* 中间的图标 */}
                <Box>
                    {icon}
                </Box>
                {/* 右侧显示节点标签 */}
                <Box sx={{ paddingLeft: '10px' }}>
                    {element.label}
                </Box>
            </Box>
        );
    };

    // 递归渲染树结构
    const CubeOutlineTree = ({ cube, initialTree }) => {
        // 从 localStorage 获取树的展开/合并状态
        const getSavedTreeState = () => {
            const savedState = localStorage.getItem(queryUuid);
            return savedState ? JSON.parse(savedState) : initialTree;
        };

        // 使用 useState 管理树的状态
        const [tree, setTree] = useState(getSavedTreeState);

        // 切换节点展开/收起状态的函数
        const toggleNodeVisibility = (nodes, itemId) => {
            return nodes.map(node => {
                if (node.itemId === itemId) {
                    return { ...node, showChildren: !node.showChildren }; // 切换节点的 showChildren 状态
                } else if (node.children) {
                    return { ...node, children: toggleNodeVisibility(node.children, itemId) }; // 递归处理子节点
                }
                return node;
            });
        };

        // 递归渲染树结构
        const renderCubeOutlineTreeItems = (nodes) => {
            return nodes.map(node => {
                let margin_left = 0; // default node.objType is 'DimensionRole'
                let icon = <NorthEastIcon />;
                if (node.objType === 'HierarchyRole') {
                    margin_left = 20;
                    icon = <DehazeIcon />;
                }
                if (node.objType === 'MemberRole') {
                    margin_left = 20 + (node.obj.member.level + 1) * 20;
                    icon = <PanoramaFishEyeIcon sx={{ fontSize: '16px' }} />;
                }

                return (
                    <Box key={node.itemId}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {/* 左侧展开/收起图标 */}
                            <Box
                                onClick={() => {
                                    if (node.children.length === 0)
                                        return;
                                    const updatedTree = toggleNodeVisibility(tree, node.itemId); // 更新树状态
                                    setTree(updatedTree); // 更新组件状态
                                    localStorage.setItem(queryUuid, JSON.stringify(updatedTree)); // 保持状态到 localStorage
                                }}
                                sx={{ marginLeft: `${margin_left}px` }}
                            >
                                {
                                    node.children.length === 0 ? <Brightness1TwoToneIcon sx={{ color: '#e0e0e0' }} /> : (node.showChildren ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />)
                                }
                            </Box>
                            <DraggableTreeNode element={node} icon={icon} />
                        </Box>
                        <Box>
                            {node.showChildren && node.children && node.children.length > 0 && renderCubeOutlineTreeItems(node.children)}
                        </Box>
                    </Box>
                );
            });
        };

        return (
            <Box>
                <h3>{cube.name}</h3>
                {renderCubeOutlineTreeItems(tree)}
            </Box>
        );
    };

    const MultidimensionalResultTableCell = ({ cell }) => {

        const [, drop] = useDrop(() => ({
            accept: DRAGGABLE_NODE_TYPE,
            drop: (element) => {
                // todo
                console.log("// todo: drop > drop", element);
            },
        }));


        return (
            <TableCell ref={drop}>{cell}</TableCell>
        );
    };

    const MultidimensionalResultTableRow = ({ row }) => {
        return (
            <TableRow>
                {
                    row.map((cell, index) => {
                        return (<MultidimensionalResultTableCell key={index} cell={cell} />);
                    })
                }
            </TableRow>
        );
    };

    const MultidimensionalResultTable = ({ resultTable }) => {
        return (
            <Table>
                <TableBody>
                    {
                        resultTable.map((row, index) => (
                            <MultidimensionalResultTableRow key={index} row={row} />
                        ))
                    }
                </TableBody>
            </Table>
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            const cubeStructure = await Fns.loadCubeStructure(data.cube_id);
            // You can add additional logic to here
            setCube(cubeStructure.cube);
            setCubeStructTree(cubeStructure.tree);
            setQueryUuid(data.query_uuid);
        };
        fetchData(); // Call the async function
    }, [data.cube_id, data.query_uuid]);

    return (
        <DndProvider backend={HTML5Backend}>
            <Box
                sx={{
                    display: 'flex',            // 使用Flexbox布局
                    height: '100vh',            // 父容器高度占满视口
                }}
            >
                {/* 左边部分 */}
                <Box
                    sx={{
                        width: 'auto',            // 宽度根据内容自动适应
                        minWidth: '320px',        // 最小宽度320px
                        maxWidth: '460px',        // 最大宽度460px
                        height: '100%',           // 高度占满父容器
                        backgroundColor: '#f1f1f1',  // 背景色设置为灰色
                    }}
                >
                    {queryUuid && cube && cubeStructTree && <CubeOutlineTree cube={cube} initialTree={cubeStructTree} />}
                </Box>

                {/* 右边部分 */}
                <Box
                    sx={{
                        flexGrow: 1,              // 占据剩余的宽度
                        //   height: '100%',           // 高度占满父容器
                        display: 'flex',            // 使用Flexbox布局
                        flexDirection: 'column',    // 垂直排列子元素
                        height: '100vh',            // 使父容器占满视口高度
                    }}
                >
                    {/* 上半部分 */}
                    <Box
                        sx={{
                            width: '100%',            // 宽度占满父容器
                            height: '50px',           // 固定高度50px
                            backgroundColor: '#e0e0e0',  // 背景色设置为灰色
                        }}
                    >
                        {/* 上半部分内容 */}
                        <h3>Top Box (50px)</h3>
                    </Box>
                    {/* 下半部分 */}
                    <Box
                        sx={{
                            width: '100%',            // 宽度占满父容器
                            flexGrow: 1,              // 占据剩余的空间
                        }}
                    >
                        <TableContainer component={Paper}>
                            <MultidimensionalResultTable resultTable={multiDimResults} />
                        </TableContainer>
                    </Box>
                </Box>
            </Box>
        </DndProvider>
    );
};

export default AdHocQuery;