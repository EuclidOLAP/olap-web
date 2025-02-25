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
  const [selectedNode, setSelectedNode] = useState(null);  // 新增选中节点的状态

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
  const toggleNodeState = async (node) => {
    node.state = node.state === '[ + ]' ? '[ - ]' : '[ + ]'; // 切换状态
    if (node.state === '[ - ]') {
      if (node.type === 'dimension_role') {
        const dim_role = node.olapEntity;
        const hierarchies = await MetaApi.load_dim_hierarchies(node.olapEntity.dimensionGid);
        node.children = hierarchies.map((hierarchy) => ({
          key: `${dim_role.gid}_${hierarchy.gid}`,
          state: '[ + ]',
          display: `[结构角色] ${hierarchy.name}`,
          type: 'hierarchy_role',
          olapEntity: {
            dimensionRole: dim_role,
            hierarchy,
          },
          children: [],
        }));
      } else if (node.type === 'hierarchy_role') {
        const dimensionRole = node.olapEntity.dimensionRole;
        const hierarchy = node.olapEntity.hierarchy;
        const members = await MetaApi.load_hierarchy_members(hierarchy.gid);
        const root = members.filter((m) => m.parentGid === 0)[0];

        node.children = [{
          key: `${dimensionRole.gid}_${root.gid}`,
          state: '[ + ]',
          display: `[成员角色] ${root.name}`,
          type: 'member_role',
          olapEntity: {
            dimensionRole,
            member: root,
          },
          children: [],
        }];
      } else if (node.type === 'member_role') {
        const parent_member = node.olapEntity.member;
        const hierarchy_gid = node.olapEntity.member.hierarchyGid;
        let members = await MetaApi.load_hierarchy_members(hierarchy_gid);
        members = members.filter((m) => m.parentGid === parent_member.gid);

        node.children = members.map((m) => ({
          key: `${node.olapEntity.dimensionRole.gid}_${m.gid}`,
          state: '[ + ]',
          display: `[成员角色] ${m.name}`,
          type: 'member_role',
          olapEntity: {
            dimensionRole: node.olapEntity.dimensionRole,
            member: m,
          },
          children: [],
        }));

      }
    } else { // node.state === '[ + ]'
      node.children = [];
    }

    setTree([...tree]); // 更新state以触发重新渲染
  };

  // 递归渲染树形结构的函数
  const handleNodeClick = (node) => {
    setSelectedNode(node.key);  // 更新选中节点的key
    callback_selected_node(node);
  };

  const renderTree = (node) => {
    const isSelected = node.key === selectedNode;  // 判断当前节点是否被选中
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
              style={{
                cursor: 'pointer',
                marginLeft: 8,
                backgroundColor: isSelected ? '#d3d3d3' : 'transparent',  // 设置选中节点的背景色
                padding: '2px 4px', // 增加一些内边距，使背景色更明显
              }}
              onClick={() => handleNodeClick(node)}  // 点击节点时更新选中状态
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
