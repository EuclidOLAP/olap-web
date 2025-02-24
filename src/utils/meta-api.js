/**
 * The purpose of this component is to encapsulate RESTful-call-requests to meta-server service.
 */
import config from '../config';
import axios from 'axios';

const load_cube_dim_roles = async (cube_gid) => {
    let dimensionRoles = await axios.get(`${config.metaServerBaseURL}/api/dimensionRoles`);
    return dimensionRoles.data.data.filter(role => `${role.cubeGid}` === `${cube_gid}`);
};

const MetaApi = {
    load_cube_dim_roles
};

export default MetaApi;
