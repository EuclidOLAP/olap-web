/**
 * The purpose of this component is to encapsulate RESTful-call-requests to meta-server service.
 */
import config from '../config';
import axios from 'axios';

const load_cube_dim_roles = async (cube_gid) => {
    let dimensionRoles = await axios.get(`${config.metaServerBaseURL}/api/dimensionRoles`);
    return dimensionRoles.data.data.filter(role => `${role.cubeGid}` === `${cube_gid}`);
};

const load_dim_hierarchies = async (dimension_gid) => {
    const hierarchies = await axios.get(`${config.metaServerBaseURL}/api/dimension/${dimension_gid}/hierarchies`);
    return hierarchies.data.hierarchies;
};

const load_hierarchy_members = async (hierarchy_gid) => {
    const response = await axios.get(`${config.metaServerBaseURL}/api/hierarchy/${hierarchy_gid}/members`);
    const members = response.data.members;
    return members;
};

const MetaApi = {
    load_cube_dim_roles,
    load_dim_hierarchies,
    load_hierarchy_members,
};

export default MetaApi;
