import config from '../config';
import axios from 'axios';

const Fns = {

    loadCubeStructure: async (cube_gid) => {

        const tree = [];

        // 获得Cube实例
        let cube = await axios.get(`${config.metaServerBaseURL}/api/cubes`);
        cube = cube.data.data.find(cube => cube.gid === cube_gid);

        // 获得Cube对应的全部（非度量）维度角色
        let dimensionRoles = await axios.get(`${config.metaServerBaseURL}/api/dimensionRoles`);
        dimensionRoles = dimensionRoles.data.data.filter(dr => dr.cubeGid === cube_gid);

        for (const dr of dimensionRoles) {
            const dimension_role_item = {
                itemId: `${dr.gid}`,
                label: dr.name,
                children: [],
                obj: dr,
                objType: 'DimensionRole',
                showChildren: true,
            };

            // 加载此维度（角色）下的全部Hierarchies
            let hierarchies = await axios.get(`${config.metaServerBaseURL}/api/dimension/${dr.dimensionGid}/hierarchies`);
            hierarchies = hierarchies.data.hierarchies;

            for (const hierarchy of hierarchies) {
                const hierarchy_role_item = {
                    itemId: `${dr.gid}_${hierarchy.gid}`,
                    label: hierarchy.name,
                    children: [],
                    obj: {
                        hierarchy,
                        dimensionRole: dr
                    },
                    objType: 'HierarchyRole',
                    showChildren: false,
                };

                let members = await axios.get(`${config.metaServerBaseURL}/api/hierarchy/${hierarchy.gid}/members`);
                members = members.data.members;
                const member_role_items_map = {};
                for (const member of members) {
                    member_role_items_map[member.gid] = {
                        itemId: `${dr.gid}_${member.gid}`,
                        label: member.name,
                        children: [],
                        obj: {
                            member,
                            hierarchy,
                            dimensionRole: dr
                        },
                        objType: 'MemberRole',
                        showChildren: false,
                    };
                }

                for (const member of members) {
                    if (member.parentGid === 0) { // Root Member
                        hierarchy_role_item.children.push(member_role_items_map[member.gid]);
                    } else { // Isn't Root Member
                        let parentMemberRoleItem = member_role_items_map[member.parentGid];
                        parentMemberRoleItem.children.push(member_role_items_map[member.gid]);
                    }
                }

                dimension_role_item.children.push(hierarchy_role_item);
            }

            tree.push(dimension_role_item);
        }

        return {
            cube,
            tree
        };
    }
};

export default Fns;