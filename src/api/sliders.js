import Axios from '../utils/axios';

/**
 * @type        {function}
 * @description define store new slider
 * @param       {Object} payload
 * @return      {Promise}
 */
export const store = payload => Axios({
    url: 'sliders/store',
    method: 'post',
    data: payload
});

/**
 * @type        {function}
 * @description define get data for edit
 * @param       {number} id
 * @return      {Promise}
 */
export const edit = id => Axios({
    url: `sliders/edit/${id}`,
    method: 'get',
});

/**
 * @type        {function}
 * @description define update slider request
 * @param       {number} id
 * @param       {Object} payload
 * @return      {Promise}
 */
export const update = (id,payload) => Axios({
    url: `sliders/update/${id}`,
    method: 'post',
    data: payload
});

/**
 * @type        {function}
 * @description define update sliders orders
 * @param       {Object} payload
 * @return      {Promise}
 **/
export const updateOrders = payload => Axios({
    url: 'sliders/update-sliders-order',
    method: 'post',
    data: payload
});

/**
 * @type        {function}
 * @description define update slider status request
 * @param       {number} id
 * @return      {Promise}
 */
export const updateStatus = id => Axios({
    url: `sliders/change-status/${id}`,
    method: 'get',
});

/**
 * @type        {function}
 * @description define delete slider request
 * @param       {number} id
 * @return      {Promise}
 */
export const destroy = id => Axios({
    url: `sliders/delete/${id}`,
    method: 'get'
});


/**
 * @type        {function}
 * @description define get data for orders request
 * @return      {Promise}
 */
export const prepareOrders = () => Axios({
    url: 'sliders/prepare-sort-sliders',
    method: 'get'
});