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

const CustomTreeItem = styled(TreeItem)({
    [`& .${treeItemClasses.iconContainer}`]: {
        '& .close': {
            opacity: 0.3,
        },
    },
});

const DimensionMembers = (props) => {

    const [membersTree, setMembersTree] = useState([]);

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


    // 初始化时加载数据
    useEffect(() => {

        // 获取维度所有的hierarchies
        const load_hierarchies = async () => {
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
        };

        load_hierarchies();
    }, [props.dimensionGid]);


    return (
        <Box sx={{ minHeight: 352, minWidth: 250 }}>
            Dimension GID is {props.dimensionGid}
            <RichTreeView
                // defaultExpandedItems={['grid']}
                slots={{
                    expandIcon: AddBoxIcon,
                    collapseIcon: IndeterminateCheckBoxIcon,
                    endIcon: FiberManualRecordTwoToneIcon,
                    item: CustomTreeItem,
                }}
                items={membersTree}
            />
        </Box>
    );
};

export default DimensionMembers;