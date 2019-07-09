import Axios from '../utils/axios';


/**
 * @type function
 * @description fetch initial data for show
 * @param       {Object} payload
 * @return      {Promise}
 **/
export const fetchData = ({baseUrl,perPage,page}) => Axios({
    url: `${baseUrl}?per_page=${perPage}&page=${page}`,
    method: 'get'
});
