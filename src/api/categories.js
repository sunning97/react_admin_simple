import Axios from '../utils/axios';

/**
 * @type        {function}
 * @description define store category request
 * @param       {Object} payload
 * @return      {Promise}
 */
export const store = payload => Axios({
    url: 'categories/store',
    method: 'post',
    data: payload
});

/**
 * @type        {function}
 * @description define get category for edit request
 * @param       {number} id
 * @return      {Promise}
 **/
export const edit = id => Axios({
    url: `categories/edit/${id}`,
    method: 'get',
});

/**
 * @type        {function}
 * @description define update category request
 * @param       {number} id
 * @param       {Object} payload
 * @return      {Promise}
 **/
export const update = (id,payload) => Axios({
    url: `categories/update/${id}`,
    method: 'post',
    data:payload
});

/**
 * @type        {function}
 * @description define update category status request
 * @param       {number} id
 * @return      {Promise}
 **/
export const updateStatus = id => Axios({
    url: `categories/update-status/${id}`,
    method: 'get'
});

/**
 * @type        {function}
 * @description define delete category request
 * @param       {number} id
 * @return      {Promise}
 **/
export const destroy = id => Axios({
    url: `categories/delete/${id}`,
    method: 'get'
});

/**
 * @type        {function}
 * @description define get data for sort categories request
 * @return      {Promise}
 **/
export const prepareSortCategories = () => Axios({
    url: 'categories/prepare-sort-categories',
    method: 'get'
});

/**
 * @type        {function}
 * @description define update categories's order
 * @param       {Object} payload
 * @return      {Promise}
 */
export const updateSort = payload => Axios({
    url: 'categories/update-sort',
    method: 'post',
    data: payload
});