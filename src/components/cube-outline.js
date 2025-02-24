/**
 * @file
 * @author
 * @version
 * @since
 * @description This is a generic component used to show the cube's outline (dimensions roles tree).
 */
import * as React from 'react';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import MetaApi from '../utils/meta-api';

const CubeOutline = ({ cubeGid, callback_selected_node }) => {

  const [tree, setTree] = useState([]);

  useEffect(() => {

    const data_initialization = async () => {
      // 根据cube_gid查询meta-api，获得包括度量在内的全部维度角色。
      if (cubeGid) {
        const dim_roles = await MetaApi.load_cube_dim_roles(cubeGid);
        const mapping = dim_roles.map((dr) => ({
          key: `${dr.gid}`,
          state: '[ + ]',
          display: `[维度角色] ${dr.name}`,
          type: 'dimension_role',
          olapEntity: dr,
          children: [],
        }));
        setTree(mapping);
      }
    };

    data_initialization();

  }, [cubeGid]); // 依赖数组中包含cubeGid，确保每次cubeGid变化时都重新发起请求

  // 切换节点展开/闭合状态的函数
  const toggleNodeState = (node) => {
    node.state = node.state === '[ + ]' ? '[ - ]' : '[ + ]'; // 切换状态
    console.log(node);  // 打印当前节点
    setTree([...tree]); // 更新state以触发重新渲染
  };

  // 递归渲染树形结构的函数
  const renderTree = (node) => {
    return (
      <Box key={node.key} sx={{ paddingLeft: 2 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Box>
            {/* 点击切换节点展开/闭合状态 */}
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => toggleNodeState(node)}  // 切换节点状态
            >
              {node.state}
            </span>
            {/* 点击时调用callback_selected_node，并传递当前的olapEntity */}
            <span
              style={{ cursor: 'pointer', marginLeft: 8 }}
              onClick={() => callback_selected_node(node.olapEntity)}  // 传递选中的OLAP实体
            >
              {node.display}
            </span>
          </Box>
        </Box>
        {/* 如果有子节点，递归渲染 */}
        {node.children && node.children.length > 0 && (
          <Box sx={{ paddingLeft: 2 }}>
            {node.children.map(renderTree)}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      {tree.map(renderTree)}
    </Box>
  );
};

export default CubeOutline;
