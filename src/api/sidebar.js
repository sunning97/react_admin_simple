import Axios from '../utils/axios';
import {sidebarID} from '../utils/default-settings';

/**
 * @type        {number}
 * @description define default admin sidebar menu id
 */
const adminMenuID = sidebarID ? sidebarID : 1;


/**
 * @type        {function}
 * @description define get api path request
 * @param       {string} path
 * @return      {Promise}
 **/
export const getApiPath = path => Axios({
    url: `${path}/get-api-path`,
    method: 'get',
});
/**
 * @type        {function}
 * @description define get app side bar data request
 * @return      {Promise}
 **/
export const getSideBar = () => Axios({
    url: `menus/get-all-menus/${adminMenuID}`,
    method: 'get'
});
