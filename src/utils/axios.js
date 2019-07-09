import axios from 'axios';
import {getToken,setToken} from './auth';
/**
 * @type object
 * @description create axios instance
 **/
const Axios = axios.create({
    baseURL: 'http://simpleadminapi.io/api/',
    timeOut: 10000
});

/* request pre-processing */
Axios.interceptors.request.use(
    config => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

/* response pre-processing */
Axios.interceptors.response.use(
    response => {
        const {data,headers} = response;
        if(headers.authorization){
            setToken(headers.authorization);
            data.token = headers.authorization;
        }
        return Promise.resolve(data);
    },
    error => {
        const {response} = error;
        return Promise.reject(response);
    }
);

export default Axios;