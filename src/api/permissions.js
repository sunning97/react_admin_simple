import Axios from '../utils/axios';
/**
 * @type        {function}
 * @description define store new permission request
 * @param       {Object} payload
 * @return      {Promise}
 */
export const store = payload => Axios({
    url: 'permissions/store',
    method: 'post',
    data: payload
});


/**
 * @type        {function}
 * @description define get data for edit request
 * @param       {number} id
 * @return      {Promise}
 **/
export const edit = id => Axios({
    url: `permissions/edit/${id}`,
    method: 'get'
});

/**
 * @type        {function}
 * @description define update permission request
 * @param       {number} id
 * @param       {Object} payload
 * @return      {Promise}
 */
export const update = (id, payload) => Axios({
    url: `permissions/update/${id}`,
    method: 'post',
    data: payload
});


/**
 * @type        {function}
 * @description define delete permission request
 * @param       {number} id
 * @return      {Promise}
 */
export const destroy = id => Axios({
    url: `permissions/delete/${id}`,
    method: 'get'
});