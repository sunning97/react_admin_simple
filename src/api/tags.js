import Axios from '../utils/axios';

/**
 * @type        {function}
 * @description define delete tag request
 * @param       {number} id
 * @return      {Promise}
 */
export const destroy = id => Axios({
    url: `tags/delete/${id}`,
    method: 'get'
});

/**
 * @type        {function}
 * @description define get data for edit
 * @param       {number} id
 * @return      {Promise}
 **/
export const edit = id => Axios({
    url: `tags/edit/${id}`,
    method: 'get'
});

/**
 * @type        {function}
 * @description define update tag request
 * @param       {number} id
 * @param       {Object} payload
 * @return      {Promise}
 */
export const update = (id, payload) => Axios({
    url: `tags/update/${id}`,
    method: 'post',
    data: payload
});

/**
 * @type        {function}
 * @description define store new tag request
 * @param       {Object} payload
 * @return      {Promise}
 **/
export const store = payload => Axios({
    url: 'tags/store',
    method: 'post',
    data: payload
});