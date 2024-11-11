// 展现一个维度下的成员树（包括Hierarchies和RootMembers）
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 引入 axios 库
import config from '../../config';  // 导入配置文件
import Box from '@mui/material/Box';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
// import SvgIcon from '@mui/material/SvgIcon';
import { styled } from '@mui/material/styles';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import FiberManualRecordTwoToneIcon from '@mui/icons-material/FiberManualRecordTwoTone';
import { useCallback } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

const CustomTreeItem = styled(TreeItem)({
    [`& .${treeItemClasses.iconContainer}`]: {
        '& .close': {
            opacity: 0.3,
        },
    },
});

const DimensionMembers = (props) => {

    const [membersTree, setMembersTree] = useState([]);
    const [parentMemberGid, setParentMemberGid] = useState('');
    const [openDialog, setOpenDialog] = useState(false);  // 控制Dialog的显示
    const [newMemberName, setNewMemberName] = useState('');  // 记录新成员的名称

    const load_members_by_hierarchy = async (hierarchy) => {
        try {
            const response = await axios.get(`${config.metaServerBaseURL}/api/hierarchy/${hierarchy.gid}/members`);
            if (response.data.success) {
                return response.data.members;
            }
        } catch (error) {
            console.error('Error fetching in Fn:DimensionMembers()', error);
        }
        return [];
    };

    // 获取维度所有的hierarchies
    const load_hierarchies = useCallback(async () => {
        try {
            const response = await axios.get(`${config.metaServerBaseURL}/api/dimension/${props.dimensionGid}/hierarchies`);
            if (response.data.success) {
                // console.log("response.data.hierarchies >>>>>>>>>>>>>>>>>", response.data.hierarchies);
                const hierarchies = response.data.hierarchies;

                const tree = [];

                for (let hierarchy of hierarchies) {

                    hierarchy.id = '' + hierarchy.gid;
                    hierarchy.label = hierarchy.name;
                    hierarchy.children = [];

                    let members = await load_members_by_hierarchy(hierarchy);

                    let tempMapping = {};

                    for (let m of members) {
                        m.id = '' + m.gid;
                        m.label = m.name;
                        m.children = [];

                        tempMapping[m.id] = m;
                    }

                    for (let m of members) {
                        if (m.parentGid > 0) { // 非根节点
                            let parent = tempMapping[m.parentGid];
                            parent.children.push(m);
                        } else { // 根节点
                            hierarchy.children.push(m);
                        }
                    }

                    tree.push(hierarchy);
                    console.log("@@@members >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", members);
                }

                setMembersTree(tree);
            }
        } catch (error) {
            console.error('Error fetching in Fn:load_hierarchies()', error);
        }
    }, [props.dimensionGid]);

    // 初始化时加载数据
    useEffect(() => {
        load_hierarchies();
    }, [load_hierarchies]);

    // 处理TreeItem选择事件
    const handleSelectMember = (event, parent_member_gid_str) => {
        // console.log("handleSelectMember $$$$$$$$$$$$$$$>>>>>>>>>>>>>>>", event, parent_member_gid_str);
        setParentMemberGid(parent_member_gid_str);
    };

    // 打开Dialog
    const handleOpenDialog = () => {
        // console.log("handleOpenDialog $$$$$$$$$$$$$$$> ooooooooo (((((((((( ))))))))))))))))))", parentMemberGid);
        setOpenDialog(true);
    };

    // 关闭Dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewMemberName('');
    };

    // 提交创建新成员
    const handleCreateMember = async () => {
        // console.log("parentMemberGid, newMemberName [][] ", parentMemberGid, newMemberName);
        // if (!selectedMember || !newMemberName.trim()) return;
        if (!newMemberName.trim()) {
            return;
        }

        try {
            await axios.post(`${config.metaServerBaseURL}/api/child-member`, {
                newChildMemberName: newMemberName,
                parentGid: parentMemberGid,
            });

            // 成功创建后刷新成员树
            setNewMemberName('');
            setParentMemberGid('');
            handleCloseDialog();
            // 调用 load_hierarchies 来刷新树
            load_hierarchies();
        } catch (error) {
            console.error('Error creating new member', error);
        }
    };

    return (
        <Box sx={{ minHeight: 352, minWidth: 250 }}>

            {/* 创建按钮 */}
            <Button 
                variant="contained" 
                onClick={handleOpenDialog} 
                disabled={parentMemberGid.charAt(0) !== '3'}  // 只有选中成员时可用
                sx={{ marginBottom: 2 }}
            >
                创建
            </Button>

            {/* Dimension GID is {props.dimensionGid} */}
            <RichTreeView
                // defaultExpandedItems={['grid']}
                slots={{
                    expandIcon: AddBoxIcon,
                    collapseIcon: IndeterminateCheckBoxIcon,
                    endIcon: FiberManualRecordTwoToneIcon,
                    item: CustomTreeItem,
                }}
                items={membersTree}
                onItemClick={handleSelectMember}  // 监听节点选择
            />

            {/* 创建新成员的Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>创建子级成员</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="子级成员名称"
                        fullWidth
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>取消</Button>
                    <Button onClick={handleCreateMember} variant="contained">创建</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DimensionMembers;