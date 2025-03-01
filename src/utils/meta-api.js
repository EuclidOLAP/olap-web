/**
 * The purpose of this component is to encapsulate RESTful-call-requests to meta-server service.
 */
import config from '../config';
import axios from 'axios';

const load_cube_dim_roles = async (cube_gid) => {
    let dimensionRoles = await axios.get(`${config.metaServerBaseURL}/api/dimensionRoles`);
    return dimensionRoles.data.data.filter(role => `${role.cubeGid}` === `${cube_gid}`);
};

const save_calculated_metric = async (cubeGid, newMetric) => {
    try {
        const response = await axios.post(`${config.metaServerBaseURL}/api/calculated-metrics`, newMetric);
        return response.data;  // 返回保存后的数据（例如返回的新增度量信息）
    } catch (error) {
        console.error('Error saving calculated metric:', error);
        throw error;  // 可以抛出错误以便调用者处理
    }
};

const load_cube_calculated_metrics = async (cube_gid) => {
    const response = await axios.get(`${config.metaServerBaseURL}/api/calculatedMetrics/cube/${cube_gid}`);
    return response.data.metrics;
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
    load_cube_calculated_metrics,
    save_calculated_metric,
};

export default MetaApi;
