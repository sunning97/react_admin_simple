import Axios from '../utils/axios';

/**
 * @type        {function}
 * @description define store new role request
 * @param       {Object} payload
 * @return      {Promise}
 */
export const store = payload => Axios({
    url: 'roles/store',
    method: 'post',
    data: payload
});

/**
 * @type        {function}
 * @description define get data for edit request
 * @param       {number} id
 * @return      {Promise}
 */
export const edit = id => Axios({
    url: `roles/edit/${id}`,
    method: 'get',
});

/**
 * @type        {function}
 * @description define update permission request
 * @param       {number} id
 * @param       {Object} payload
 * @return      {Promise}
 */
export const update = (id,payload) => Axios({
    url: `roles/update/${id}`,
    method: 'post',
    data: payload
});

/**
 * @type        {function}
 * @description define delete request
 * @param       {number} id
 * @return      {Promise}
 */
export const destroy = id => Axios({
    url: `roles/delete/${id}`,
    method: 'get'
});

/**
 * @type        {function}
 * @description define get permissions for assign to role
 * @param       {number} id
 * @return      {Promise}
 */
export const preparePermissions = id => Axios({
    url: `roles/prepare-assign-permissions/${id}`,
    method: 'get'
});

/**
 * @type        {function}
 * @description define update permissions of role request
 * @param       {number} id
 * @param       {Object} payload
 * @return      {Promise}
 */
export const updateRolePermissions = (id,payload)=> Axios({
    url: `roles/update-role-permissions/${id}`,
    method: 'post',
    data: payload
});