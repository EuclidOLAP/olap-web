/**
 * This is a generic component used to show the cube's outline (dimensions roles tree).
 */
import * as React from 'react';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import MetaApi from '../utils/meta-api';

const CubeOutline = ({ cubeGid }) => {

  const [tree, setTree] = useState([]);

  useEffect(() => {

    const data_initialization = async () => {
      // 根据cube_gid查询meta-api，获得包括度量在内的全部维度角色。
      if (cubeGid) {
        const dim_roles = await MetaApi.load_cube_dim_roles(cubeGid);
        const mapping = dim_roles.map((dr) => ({
          key: `${dr.gid}`,
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

  // 递归渲染树形结构的函数
  const renderTree = (node) => {
    return (
      <Box key={node.key} sx={{ paddingLeft: 2 }}>
        <Box sx={{ textAlign: 'left' }}>{node.display}</Box>
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
