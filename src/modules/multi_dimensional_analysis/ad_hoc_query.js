import React, { useState, useEffect } from 'react';
import Fns from '../../functions/fns';
import { Box } from '@mui/material';

// import * as React from 'react';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import { styled, alpha } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

// import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { useDrag } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

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

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
    [`& .${treeItemClasses.content}`]: {
        padding: theme.spacing(0.5, 1),
        margin: theme.spacing(0.2, 0),
    },
    [`& .${treeItemClasses.iconContainer}`]: {
        '& .close': {
            opacity: 0.3,
        },
    },
    [`& .${treeItemClasses.groupTransition}`]: {
        marginLeft: 15,
        paddingLeft: 18,
        borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
}));

function ExpandIcon(props) {
    return <AddBoxRoundedIcon {...props} sx={{ opacity: 0.8 }} />;
}

function CollapseIcon(props) {
    return <IndeterminateCheckBoxRoundedIcon {...props} sx={{ opacity: 0.8 }} />;
}

function EndIcon(props) {
    return <DisabledByDefaultRoundedIcon {...props} sx={{ opacity: 0.3 }} />;
}

// const CubeStructureTree = ({cube, tree}) => {
//     console.log("info >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> CubeStructureTree()");
//     console.log("cube > cube", cube);
//     console.log("tree > tree", tree);
//     return (
//         <CustomTreeItem itemId="1" label="Mainccc">
//             <CustomTreeItem itemId="2" label="Hello" />
//             <CustomTreeItem itemId="3" label="Subtree with children">
//                 <CustomTreeItem itemId="6" label="Hello" />
//                 <CustomTreeItem itemId="7" label="Sub-subtree with children">
//                     <CustomTreeItem itemId="9" label="Child 1" />
//                     <CustomTreeItem itemId="10" label="Child 2" />
//                     <CustomTreeItem itemId="11" label="Child 3" />
//                 </CustomTreeItem>
//                 <CustomTreeItem itemId="8" label="Hello" />
//             </CustomTreeItem>
//             <CustomTreeItem itemId="4" label="World" />
//             <CustomTreeItem itemId="5" label="Something something" />
//         </CustomTreeItem>
//     );
// };

// 拖拽节点组件
const DraggableTreeItem = ({ itemId, label, children }) => {
    // 设置拖拽逻辑
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'TREE_ITEM',
        item: { itemId, label },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <CustomTreeItem itemId={itemId} label={label}>
                {children}
            </CustomTreeItem>
        </div>
    );
};

// const CubeStructureTree = ({ cube, tree }) => {

//     // 递归函数，用于渲染树结构
//     const renderTreeItems = (nodes) => {
//         return nodes.map(node => (
//             <CustomTreeItem itemId={node.itemId} label={node.label} key={node.itemId}>
//                 {node.children && node.children.length > 0 && renderTreeItems(node.children)}
//             </CustomTreeItem>
//         ));
//     };

//     return (
//         <CustomTreeItem itemId={String(cube.id)} label={cube.name}>
//             {renderTreeItems(tree)}
//         </CustomTreeItem>
//     );
// };

// 递归渲染树结构
const CubeStructureTree = ({ cube, tree }) => {
    const renderTreeItems = (nodes) => {
        return nodes.map(node => (
            <DraggableTreeItem itemId={node.itemId} label={node.label} key={node.itemId}>
                {node.children && node.children.length > 0 && renderTreeItems(node.children)}
            </DraggableTreeItem>
        ));
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <CustomTreeItem itemId={String(cube.id)} label={cube.name}>
                {renderTreeItems(tree)}
            </CustomTreeItem>
        </DndProvider>
    );
};


const AdHocQuery = ({ data }) => {

    const [queryUuid, setQueryUuid] = useState(data.query_uuid);
    const [queryId, setQueryId] = useState(data.queryId); // 用于管理 Query ID 的状态
    const [cube, setCube] = useState(null);
    const [cubeStructTree, setCubeStructTree] = useState([]);


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
            return nodes.map(node => (
                <Box key={node.itemId}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* 左侧展开/收起图标 */}
                        <Box
                            onClick={() => {
                                const updatedTree = toggleNodeVisibility(tree, node.itemId); // 更新树状态
                                setTree(updatedTree); // 更新组件状态
                                localStorage.setItem(queryUuid, JSON.stringify(updatedTree)); // 保持状态到 localStorage
                            }}
                        >
                            {node.showChildren ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                        </Box>

                        {/* 中间的图标 */}
                        <Box>
                            <GraphicEqIcon />
                        </Box>

                        {/* 右侧显示节点标签 */}
                        <Box sx={{ flex: 1, textAlign: 'left' }}>
                            {node.label}
                        </Box>
                    </Box>

                    <Box>
                        {node.showChildren && node.children && node.children.length > 0 && renderCubeOutlineTreeItems(node.children)}
                    </Box>
                </Box>
            ));
        };

        return (
            <Box>
                <h1>Cube Outline Tree {cube.name}</h1>
                {renderCubeOutlineTreeItems(tree)}
            </Box>
        );
    };

    const handleInputChange = (e) => {
        setQueryId(e.target.value); // 更新 Query ID 的状态
    };

    const handleApplyChange = () => {
        alert(`Query ID 已更新为: ${queryId}`); // 提示用户 Query ID 已更新
    };

    useEffect(() => {
        const fetchData = async () => {
            const cubeStructure = await Fns.loadCubeStructure(data.cube_id);
            console.log("cubeStructure >>>>>>>>>>>>>>>>>> cubeStructure >>>>>>>>>>>>>>>>>>", cubeStructure);
            // You can add additional logic to here
            setCube(cubeStructure.cube);
            setCubeStructTree(cubeStructure.tree);
            setQueryUuid(data.query_uuid);
        };
        fetchData(); // Call the async function
    }, [data.cube_id, data.query_uuid]);

    return (
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
                    backgroundColor: 'gray',  // 背景色设置为灰色
                }}
            >

                {queryUuid && cube && cubeStructTree && <CubeOutlineTree cube={cube} initialTree={cubeStructTree} />}

                <SimpleTreeView
                    aria-label="customized"
                    defaultExpandedItems={['1', '3']}
                    slots={{
                        expandIcon: ExpandIcon,
                        collapseIcon: CollapseIcon,
                        endIcon: EndIcon,
                    }}
                    sx={{ overflowX: 'hidden', minHeight: 270, flexGrow: 1, maxWidth: 300 }}
                >
                    {/* <CubeStructureTree cube={cube} tree={tree} /> */}
                    {cube && cubeStructTree && <CubeStructureTree cube={cube} tree={cubeStructTree} />}
                </SimpleTreeView>

            </Box>

            {/* 右边部分 */}
            <Box
                sx={{
                    flexGrow: 1,              // 占据剩余的宽度
                    //   height: '100%',           // 高度占满父容器
                    backgroundColor: 'lightgray', // 背景色设置为浅灰色
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
                        backgroundColor: 'gray',  // 背景色设置为灰色
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
                        backgroundColor: 'lightgray', // 背景色设置为浅灰色
                    }}
                >
                    {/* 下半部分内容 */}
                    {/* <h3>Bottom Box (remaining space)</h3> */}

                    {/* 右边部分内容 */}
                    {/* <h3>Right Box (remaining space)</h3> */}
                    <div>
                        {/* <h1>Ad Hoc Query Component</h1> */}
                        <p>Query ID: {queryId}</p>
                        <div>
                            <input
                                type="number"
                                value={queryId}
                                onChange={handleInputChange}
                                style={{ marginRight: '10px', padding: '5px' }}
                            />
                            <button onClick={handleApplyChange} style={{ padding: '5px 10px' }}>
                                应用修改
                            </button>
                        </div>
                    </div>

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

export default AdHocQuery;



/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////



// import React, { useState } from "react";
// import { DndProvider, useDrag, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";

// const ItemType = "TREE_NODE";

// // TreeNode组件，用于显示树节点
// const TreeNode = ({ node, moveNode }) => {
//   const [monitor, drag] = useDrag(() => ({
//     type: ItemType,
//     item: node,
//   }));

//   console.log("monitor >>>>>>>>>>>>>>>>>>>>> monitor", monitor);
//   console.log("drag > drag", drag);

//   return (
//     <div ref={drag} style={{ paddingLeft: 20 }}>
//       {node.name}
//     </div>
//   );
// };

// // TreeView组件，渲染树形视图
// const TreeView = ({ nodes, moveNode }) => {
//   return (
//     <div>
//       {nodes.map((node) => (
//         <TreeNode key={node.id} node={node} moveNode={moveNode} />
//       ))}
//     </div>
//   );
// };

// // TableRow组件，用于显示表格中的行
// const TableRow = ({ node }) => {
//   return (
//     <tr>
//       <td>{node.name}</td>
//     </tr>
//   );
// };

// // Table组件，渲染表格
// const Table = ({ droppedItems }) => {
//   return (
//     <table border="1">
//       <thead>
//         <tr>
//           <th>Node Name</th>
//         </tr>
//       </thead>
//       <tbody>
//         {droppedItems.map((item, index) => (
//           <TableRow key={index} node={item} />
//         ))}
//       </tbody>
//     </table>
//   );
// };

// // DropZone组件，用于处理拖拽放置
// const DropZone = ({ dropNode }) => {
//   const [, drop] = useDrop(() => ({
//     accept: ItemType,
//     drop: (item) => {
//       dropNode(item);
//     },
//   }));

//   return <div ref={drop} style={{ marginTop: 20, padding: 10, border: "1px dashed #ccc" }}>Drop here to add to table</div>;
// };

// // MainApp组件，处理状态和逻辑
// const MainApp = () => {
//   const [treeNodes] = useState([
//     { id: 1, name: "Node 1" },
//     { id: 2, name: "Node 2" },
//     { id: 3, name: "Node 3" },
//   ]);
//   const [droppedItems, setDroppedItems] = useState([]);

//   const moveNode = (node) => {
//     setDroppedItems((prevItems) => [...prevItems, node]);
//   };

//   return (
//     <div style={{ display: "flex", justifyContent: "space-around" }}>
//       <div>
//         <h3>Tree View</h3>
//         <TreeView nodes={treeNodes} moveNode={moveNode} />
//       </div>
//       <div>
//         <h3>Drop Zone</h3>
//         <DropZone dropNode={moveNode} />
//       </div>
//       <div>
//         <h3>Table</h3>
//         <Table droppedItems={droppedItems} />
//       </div>
//     </div>
//   );
// };

// // App组件，包装在DndProvider中，使用HTML5Backend
// const App = () => {
//   return (
//     <DndProvider backend={HTML5Backend}>
//       <MainApp />
//     </DndProvider>
//   );
// };

// export default App;
