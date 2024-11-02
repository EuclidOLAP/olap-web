import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 引入 axios 库
import { List, ListItem, ListItemText } from '@mui/material';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Button, TextField, DialogActions } from '@mui/material';
import config from '../config';  // 导入配置文件

const DimensionModelManagement = () => {

  const [dimensionName, setDimensionName] = useState('');
  const [dimensions, setDimensions] = useState([]);  // 用于存储维度数据

  const [selectedDimension, setSelectedDimension] = useState(null);     // 存储点击维度列表时选中的维度实例
  const [dimensionMembersTree, setDimensionMembersTree] = useState([]); // 一个维度可以有多个RootMember，因为一个维度可能有多个Hierarchy
  const [dialogOpen, setDialogOpen] = useState(false);                  // 用于打开 Dialog 显示维度成员树

  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false); // 控制添加子成员对话框
  const [newChildMemberName, setNewChildMemberName] = useState(''); // 新建的子级成员名称
  const [parentMemberId, setParentMemberId] = useState(null);       // 新建的子级成员的父GID

  const handleDimensionNameChange = (event) => {
    setDimensionName(event.target.value);
  };

  // 获取所有维度的函数
  const fetchDimensions = async () => {
    try {
      const response = await axios.get(`${config.metaServerBaseURL}/api/dimensions`); // 假设后端运行在该端口
      if (response.data.success) {
        setDimensions(response.data.data);  // 更新维度列表
      }
    } catch (error) {
      console.error('Error fetching dimensions:', error);
    }
  };

  // 初始化时加载维度数据
  useEffect(() => {
    fetchDimensions();
  }, []);

  const createDimensionButtonSubmit = async () => {
    console.log(">>>>>>>>>>>>>>>>++++++ Submitted value: ", dimensionName);
    try {
      // 调用 meta-server 的 API
      const response = await axios.post(`${config.metaServerBaseURL}/api/dimension`, {
        name: dimensionName
      });
      console.log('Dimension created:', response.data);

      // 这里你可以做更多的事情，比如显示一个成功信息或清空表单
      fetchDimensions(); // 刷新维度列表

    } catch (error) {
      console.error('Error creating dimension:', error);
    }
  };


  // 显示维度成员树的函数
  const fetchDimensionMembers = async (dimension_gid) => {
    try {
      const response = await axios.get(`${config.metaServerBaseURL}/api/dimension/${dimension_gid}/members`);
      if (response.data.success) {

        const memberMap = {};
        response.data.members.forEach((member) => { member.children = []; memberMap[member.gid] = member; });
        const root_members_tree = [];
        response.data.members.forEach((member) => {
          if (member.parentGid !== 0) { // member is not a Root.
            memberMap[member.parentGid].children.push(member);
          } else { // member is a Root.
            root_members_tree.push(member);
          }
        });

        setDimensionMembersTree(root_members_tree);
        setDialogOpen(true);  // 打开 Dialog
      }
    } catch (error) {
      console.error('Error fetching dimension members:', error);
    }
  };

  // 添加子成员
  const createChildMember = async () => {
    try {
      const response = await axios.post(`${config.metaServerBaseURL}/api/child-member`, {
        newChildMemberName: newChildMemberName,
        parentGid: parentMemberId
      });

      setAddMemberDialogOpen(false);
      fetchDimensionMembers(selectedDimension.gid); // 刷新维度成员树
      // setNewChildMemberName('');
      console.log('Child member created:', response.data);
    } catch (error) {
      console.error('Error adding child member:', error);
    }
  };

  // 打开添加子成员对话框
  const handleOpenCreateChildMemberDialog = (parent_gid) => {
    setParentMemberId(parent_gid);
    setAddMemberDialogOpen(true);
  };

  // 递归渲染成员树
  const renderMemberTree = (members_tree) => {
    return members_tree.map((member) => (
      <li key={member.gid}>
        {member.name}
        <Button size="small" onClick={() => handleOpenCreateChildMemberDialog(member.gid)}> [ + ] </Button>
        {member.children && member.children.length > 0 && (
          <ul>{renderMemberTree(member.children)}</ul>
        )}
      </li>
    ));
  };


  return (
    <div>
      <h1>Dimension Model Management</h1>

      <div>
        <p>Create Dimension</p>
        <input type="text" value={dimensionName} onChange={handleDimensionNameChange} placeholder="type dimension name here" />
        <br />
        <button onClick={createDimensionButtonSubmit}>create a new dimension</button>
      </div>

      <div>
        {/* 维度列表 */}
        <List>
          {dimensions.map((dimension) => (
            <ListItem key={dimension.gid} onClick={() => { fetchDimensionMembers(dimension.gid); setSelectedDimension(dimension); }}>
              <ListItemText primary={dimension.name} />
            </ListItem>
          ))}
        </List>
      </div>


      {/* 维度成员 Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle>{`===@>>> ${selectedDimension ? selectedDimension.name : '维度成员'} <<<@===`}</DialogTitle>
        <DialogContent>
          <ul>{renderMemberTree(dimensionMembersTree)}</ul>
        </DialogContent>
      </Dialog>

      {/* 添加子成员 Dialog */}
      <Dialog open={addMemberDialogOpen} onClose={() => {setAddMemberDialogOpen(false); setNewChildMemberName('');} } fullWidth maxWidth="sm">
        <DialogTitle>Create a Child Member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="child member name"
            fullWidth
            value={newChildMemberName}
            onChange={(e) => setNewChildMemberName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {setAddMemberDialogOpen(false); setNewChildMemberName('');}}>Cancel</Button>
          <Button onClick={() => {createChildMember();setNewChildMemberName('');}}>Confirm</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default DimensionModelManagement;
