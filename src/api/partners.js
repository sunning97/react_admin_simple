import Axios from '../utils/axios';

/**
 * @type        {Function}
 * @description define get partner for edit request
 * @param       {number} id
 * @returns     {Promise}
 */
export const edit = id => Axios({
    url: `partners/edit/${id}`,
    method: 'get'
});

/**
 * @type        {Function}
 * @description define store new partner request
 * @param       {FormData} payload
 * @returns     {Promise}
*/
export const store = payload => Axios({
    url: 'partners/store',
    method: 'post',
    data: payload
});

/**
 * @type        {Function}
 * @description define update partner request
 * @param       {number} id
 * @param       {FormData} payload
 * @returns     {Promise}
 */
export const update = (id, payload) => Axios({
    url: `partners/update/${id}`,
    method: 'post',
    data: payload
});

/** 
 * @type        {Function}
 * @description define delete partner request
 * @param       {number} id
 * @returns     {Promise}
*/
export const destroy = id => Axios({
    url: `partners/delete/${id}`,
    method: 'get'
});

/**
 * @type        {Function}
 * @description define prepare partners for sort request
 * @returns     {Promise}
 */
export const prepareSort = () => Axios({
    url: 'partners/prepare-sort',
    method: 'get'
});

/**
 * @type        {Function}
 * @description define update sort partners request
 * @param       {Object} payload
 * @returns     {Promise}
 */
export const updateSort = payload => Axios({
    url: 'partners/update-sort',
    method: 'post',
    data: payload
});

/**
 * @type        {Function}
 * @description define update status request
 * @param       {number} id
 * @returns     {Promise}
 */
export const updateStatus = id => Axios({
    url: `partners/update-status/${id}`,
    method: 'get'
});