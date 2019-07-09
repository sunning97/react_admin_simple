import Axios from '../utils/axios';

/**
 * @type        {function}
 * @description define delete menu type request
 * @param       {number} id
 * @return      {Promise}
 **/
export const destroyMenuType = id => Axios({
    url: `menus/delete-menu-type/${id}`,
    method: 'get',
});


/**
 * @type        {function}
 * @description define delete menu request
 * @param       {number} id
 * @return      {Promise}
 **/
export const destroyMenu = id => Axios({
    url: `menus/delete-menu/${id}`,
    method: 'get'
});

/**
 * @type        {function}
 * @description define get menus data for sort
 * @param       {number} id
 * @return      {Promise}
 **/
export const prepareMenus = id => Axios({
    url: `menus/get-all-menus/${id}`,
    method: 'get'
});


/**
 * @type        {function}
 * @description define store menu request
 * @param       {Object} payload
 * @return      {Promise}
 **/
export const storeMenu = payload => Axios({
    url: `menus/store-menu`,
    method: 'post',
    data: payload
});

/**
 * @type        {function}
 * @description define store menu type request
 * @param       {Object} payload
 * @return      {Promise}
 **/
export const storeMenuType = payload => Axios({
    url: 'menus/store-menu-type',
    method: 'post',
    data: payload
});

/**
 * @type        {function}
 * @description define update menu request
 * @param       {number} id
 * @param       {Object} payload
 * @return      {Promise}
 **/

export const updateMenu = (id,payload) => Axios({
    url: `menus/update-menu/${id}`,
    method: 'post',
    data: payload
});


/**
 * @type        {function}
 * @description define update menu type request
 * @param       {number} id
 * @param       {Object} payload
 * @return      {Promise}
 **/
export const updateMenuType = (id,payload) => Axios({
    url: `menus/update-menu-type/${id}`,
    method: 'post',
    data: payload
});

/**
 * @type        {function}
 * @description define update menu status
 * @param       {number} id
 * @return      {Promise}
 */
export const updateStatus = id => Axios({
    url: `menus/update-status/${id}`,
    method: 'get',
});

/**
 * @type        {function}
 * @description define update menu order request
 * @param       {Object} payload
 * @return      {Promise}
 * **/
export const updateSort = payload =>Axios({
    url: 'menus/update-sort',
    method: 'post',
    data: payload
});


/**
 * @type        {function}
 * @description define get menu type fpr edit request
 * @param       {number} id
 * @return      {Promise}
 */
export const editMenuType = id => Axios({
    url: `menus/edit-menu-type/${id}`,
    method: 'get'
});

/**
 * @type        {function}
 * @description define get menu for edit request
 * @param       {number} id
 * @return      {Promise}
 */
export const editMenu = id => Axios({
    url: `menus/edit-menu/${id}`,
    method: 'get'
});