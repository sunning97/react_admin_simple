import Axios from '../utils/axios';
/**
 * @type        {function}
 * @description define login request
 * @param       {Object} payload
 * @return      {Promise}
 */
export const login = payload => Axios({
    url: 'login',
    method: 'post',
    data: payload
});

/**
 * @type        {function}
 * @description define logout request
 * @return      {Promise}
 */
export const logout = () => Axios({
    url: 'logout',
    method: 'get',
});

/**
 * @type        {function}
 * @description define get user information request
 * @return      {Promise}
 */
export const me = () => Axios({
    url: 'me',
    method: 'get'
});

/**
 * @type        {function}
 * @description define get new token request
 * @return      {Promise}
 **/
export const refresh = () => Axios({
    url: 'refresh',
    method: 'get'
});