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

import MdmInstanceTypes from '../../functions/constants';

import CubeOutline from '../../components/cube-outline';

import config from '../../config';
import axios from 'axios';

const ADHOC_TABS_QUERY_CUBE_STRUCT_TREES_STATUS_MAP = {};

const DRAGGABLE_NODE_TYPE = 'DRAGGABLE_NODE_TYPE';

function createArray(width, height) {
    const result = [];

    for (let i = 0; i < height; i++) {
        const row = [];
        for (let j = 0; j < width; j++) {
            row.push({ display: '...', position: '0' });
        }
        result.push(row);
    }

    return result;
}

function generateCartesianProduct(param_arr) {
    // 计算笛卡尔积
    const product = param_arr.reduce((acc, curr) => {
        const newAcc = [];
        acc.forEach(accItem => {
            curr.forEach(currItem => {
                newAcc.push([...accItem, currItem]);
            });
        });
        return newAcc.length === 0 ? curr.map(item => [item]) : newAcc;
    }, [[]]);

    // 获取生成的二维数组的宽度和高度
    const height = product.length; // 新数组的行数
    const width = product[0].length; // 新数组的列数

    return {
        array: product,
        width,
        height
    };
}

function rotateMatrix(matrix) {
    const height = matrix.length;
    const width = matrix[0].length;

    // 创建一个新的矩阵，用于存储旋转后的结果
    const rotatedMatrix = new Array(width);
    for (let i = 0; i < width; i++) {
        rotatedMatrix[i] = new Array(height);
    }

    // 旋转矩阵
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            // rotatedMatrix[j][height - i - 1] = matrix[i][j];
            rotatedMatrix[j][i] = matrix[i][j];
        }
    }

    return {
        matrix: rotatedMatrix,
        matrix_w: height,
        matrix_h: width
    };
}

function splice_mdx_set_str(member_roles_info_2d_arr) {
    const d2_arr = member_roles_info_2d_arr;
    if (d2_arr.length === 0)
        return null;

    let set_str = [];
    for (const tuple_info of d2_arr) {
        let tuple_str = [];
        for (const mr of tuple_info) { // mr is a MemberRole object
            const dr = mr.dimensionRole; // dr is a DimensionRole object
            const mbr = mr.member; // mbr is a Member object
            tuple_str.push(`&${dr.gid}[${dr.name}].&${mbr.gid}[${mbr.name}]`);
        }
        tuple_str = `( ${tuple_str.join(', ')} )`;
        set_str.push(tuple_str);
    }
    set_str = `{\n${set_str.join(',\n')}\n}`;
    return set_str;
}

class OlapQueryTableStruct {
    constructor({ cubeGid }) {

        this.cubeGid = cubeGid;

        this.rowsDimensionsRoles = [];
        this.colsDimensionsRoles = [];

        this.rowsStruct = [];
        this.colsStruct = [];

        this.table = [
            [{ display: '⟳', position: 'pivot' }, { display: 'COLUMNS', position: 'columns' }],
            [{ display: 'ROWS', position: 'rows' }, { display: '<measures>', position: 'measures' }],
        ];
    }

    async redrawTable() {

        let row_w = this.rowsStruct.length;
        let row_h = row_w ? 1 : 0;
        for (const _1d_arr of this.rowsStruct) {
            row_h *= _1d_arr.length;
        }

        let col_h = this.colsStruct.length;
        let col_w = col_h ? 1 : 0;
        for (const _1d_arr of this.colsStruct) {
            col_w *= _1d_arr.length;
        }

        if (row_w === 0 && col_h === 0) {
            this.table = [
                [{ display: '⟳', position: 'pivot' }, { display: 'COLUMNS', position: 'columns' }],
                [{ display: 'ROWS', position: 'rows' }, { display: '<measures>', position: 'measures' }],
            ];
        } else if (row_w !== 0 && col_h === 0) {
            this.table = createArray(row_w + 1, row_h + 1);
        } else if (row_w === 0 && col_h !== 0) {
            this.table = createArray(col_w + 1, col_h + 1);
        } else { // row_w !== 0 && col_h !== 0
            this.table = createArray(row_w + col_w, row_h + col_h);
            let vector_index = 0;
            for (let r = 0; r < row_h; r++) {
                for (let c = 0; c < col_w; c++) {
                    this.table[r + col_h][c + row_w].vector_index = vector_index++;
                }
            }
        }

        const row_top_offset = col_h ? col_h : 1;
        const col_left_offset = row_w ? row_w : 1;

        let rows_mdx_arr = [];
        let cols_mdx_arr = [];

        if (row_w) {
            // console.log(">>> :::ROW::: >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            const { array, width, height } = generateCartesianProduct(this.rowsStruct);
            rows_mdx_arr = array;

            for (let h = 0; h < height; h++) {
                for (let w = 0; w < width; w++) {
                    this.table[h + row_top_offset][w] = { display: array[h][w].member.name, position: 'rows' };
                    // console.log(`table[${h + row_top_offset}][${w}]\t\t${array[h][w].member.name} >>> `, array[h][w]);
                }
            }

        } else {
            this.table[row_top_offset][0] = { display: 'ROWS', position: 'rows' };
        }

        if (col_h) {
            // console.log(">>> :::COL::: >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            // const { array, width, height } = generateCartesianProduct(this.colsStruct);
            const { array } = generateCartesianProduct(this.colsStruct);
            cols_mdx_arr = array;

            const { matrix, matrix_w, matrix_h } = rotateMatrix(array);
            for (let h = 0; h < matrix_h; h++) {
                for (let w = 0; w < matrix_w; w++) {
                    this.table[h][w + col_left_offset] = { display: matrix[h][w].member.name, position: 'columns' };
                    // console.log(`table[${h}][${w + col_left_offset}]\t\t${matrix[h][w].member.name} >>> `, matrix[h][w]);
                }
            }
        } else {
            this.table[0][col_left_offset] = { display: 'COLUMNS', position: 'columns' };
        }

        // 到此为止，table 已经生成完毕，rows和columns位置上应该显示的多维模型对象实例（目前只是MemberRole）已经确定
        // 接下来要拼装MDX，并调用后端的API接口进行查询

        // console.log(">>> make a mdx query >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        // console.log("rows_mdx_arr: ", rows_mdx_arr);
        // console.log("cols_mdx_arr: ", cols_mdx_arr);

        const rows_mdx_str = splice_mdx_set_str(rows_mdx_arr);
        const cols_mdx_str = splice_mdx_set_str(cols_mdx_arr);

        if (rows_mdx_str === null || cols_mdx_str === null)
            return;

        // console.log("rows_mdx_str", rows_mdx_str);
        // console.log("cols_mdx_str", cols_mdx_str);

        // 拼接完整的MDX语句
        const mdx = `select\n${rows_mdx_str}\non rows,\n${cols_mdx_str}\non columns\nfrom &${this.cubeGid};`;

        const response = await axios.post(`${config.metaServerBaseURL}/md-query/mdx`, { mdx });
        // console.log("response: ", response);

        // 得到查询结果后，更新 table 组件的显示内容
        const vectors = response.data;
        for (const row of this.table) {
            for (const grid of row) {
                if (!grid.hasOwnProperty('vector_index'))
                    continue;
                const vector = vectors[grid.vector_index];
                grid.display = vector.null_flag ? '' : `${vector.val}`;
            }
        }
    }

    dropMDMInstanceRole(position, instance) {
        if (instance.objType === MdmInstanceTypes.MEMBER_ROLE) {
            this.dropMemberRole(position, instance, instance.obj);
        }
    }

    dropMemberRole(position, instance, memberRole) {
        let rc_struct = position === 'rows' ? this.rowsStruct : this.colsStruct;
        let dimenison_roles = position === 'rows' ? this.rowsDimensionsRoles : this.colsDimensionsRoles;

        let dr_index = -1;

        for (const [index, dimensionRole] of dimenison_roles.entries()) {
            if (dimensionRole.gid === memberRole.dimensionRole.gid)
                dr_index = index;
        }

        if (dr_index === -1) {
            dimenison_roles.push(memberRole.dimensionRole);
            rc_struct.push([memberRole]);
        } else {
            rc_struct[dr_index].push(memberRole);
        }

    }
}

const AdHocQuery = ({ data }) => {

    const [queryUuid, setQueryUuid] = useState(data.query_uuid);
    const [cube, setCube] = useState(null);
    const [cubeStructTree, setCubeStructTree] = useState([]);
    const [olapTableStruct, setOlapTableStruct] = useState(new OlapQueryTableStruct({ cubeGid: data.cube_id }));

    const DraggableTreeNode = ({ element, icon }) => {

        const [, drag] = useDrag(() => ({
            type: DRAGGABLE_NODE_TYPE,
            item: element,
        }));

        return (
            <Box ref={element.objType === MdmInstanceTypes.MEMBER_ROLE ? drag : null} sx={{ flex: 1, display: 'flex' }}>
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
            // const savedState = localStorage.getItem(queryUuid);
            const savedState = ADHOC_TABS_QUERY_CUBE_STRUCT_TREES_STATUS_MAP[queryUuid];
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
                if (node.objType === MdmInstanceTypes.HIERARCHY_ROLE) {
                    margin_left = 20;
                    icon = <DehazeIcon />;
                }
                if (node.objType === MdmInstanceTypes.MEMBER_ROLE) {
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
                                    ADHOC_TABS_QUERY_CUBE_STRUCT_TREES_STATUS_MAP[queryUuid] = JSON.stringify(updatedTree); // 更新状态缓存
                                    // localStorage.setItem(queryUuid, JSON.stringify(updatedTree)); // 保持状态到 localStorage
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
            drop: async (element) => {
                olapTableStruct.dropMDMInstanceRole(cell.position, element);

                await olapTableStruct.redrawTable();

                let new_ots = new OlapQueryTableStruct({ cubeGid: olapTableStruct.cubeGid });
                Object.assign(new_ots, olapTableStruct);

                setOlapTableStruct(new_ots);
            },
        }));

        if (cell.position === 'rows' || cell.position === 'columns') {
            return (<TableCell sx={{ border: '1px solid grey' }} ref={drop}>{cell.display}</TableCell>);
        } else {
            return (<TableCell sx={{ border: '1px solid grey' }}>{cell.display}</TableCell>);
        }
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

        // 清理函数，在组件卸载时执行
        return () => {
            // 卸载时执行的逻辑
            Reflect.deleteProperty(ADHOC_TABS_QUERY_CUBE_STRUCT_TREES_STATUS_MAP, data.query_uuid);
        };
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
                        overflow: 'auto',         // 内容溢出时显示滚动条
                        backgroundColor: '#f1f1f1',  // 背景色设置为灰色
                    }}
                >
                    {queryUuid && cube && cubeStructTree && <CubeOutlineTree cube={cube} initialTree={cubeStructTree} />}
                </Box>

                {/* 中间部分 */}
                <Box
                    sx={{
                        width: 'auto',            // 宽度根据内容自动适应
                        minWidth: '320px',        // 最小宽度320px
                        maxWidth: '460px',        // 最大宽度460px
                        height: '100%',           // 高度占满父容器
                        overflow: 'auto',         // 内容溢出时显示滚动条
                        backgroundColor: '#f1f1f1',  // 背景色设置为灰色
                    }}
                >
                    { cube && <CubeOutline cubeGid={cube.gid} callback_selected_node={(node) => {
                        // console.log("do nothing ..................", node);
                    }} options={{ draggable: true }} /> }
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
                            padding: '15px',          // 内边距10px
                            overflow: 'auto',
                        }}
                    >
                        <TableContainer component={Paper}>
                            <MultidimensionalResultTable resultTable={olapTableStruct.table} />
                        </TableContainer>
                    </Box>
                </Box>
            </Box>
        </DndProvider>
    );
};

export default AdHocQuery;