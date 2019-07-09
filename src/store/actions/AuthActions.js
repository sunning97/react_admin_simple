import {login, me} from '../../api/auth';
import {setExpireAt, setToken} from '../../utils/auth';

/**
 * @type        {string}
 * @description define auth action type
 * **/
const STORE_TOKEN = 'STORE_TOKEN';
const REMOVE_TOKEN = 'REMOVE_TOKEN';
const STORE_AUTH_INFO = 'STORE_AUTH_INFO';
const REMOVE_AUTH_INFO = 'REMOVE_AUTH_INFO';
const STORE_EXPIRE_AT = 'STORE_EXPIRE_AT';
const REMOVE_EXPIRE_AT = 'REMOVE_EXPIRE_AT';
const STORE_LOGIN_ERRORS = 'STORE_LOGIN_ERRORS';
const REMOVE_LOGIN_ERRORS = 'REMOVE_LOGIN_ERRORS';


/**
 * @type        {function}
 * @description define sync action creator
 **/
const storeAuthInfo = info => ({type: STORE_AUTH_INFO, info});
const removeAuthInfo = () => ({type: REMOVE_AUTH_INFO});
const storeToken = token => ({type: STORE_TOKEN, token});
const removeToken = () => ({type: REMOVE_TOKEN});
const storeExpireAt = (time) => ({type: STORE_EXPIRE_AT, time});
const removeExpireAt = () => ({type: REMOVE_EXPIRE_AT});
const storeLoginErrors = errors => ({type: STORE_LOGIN_ERRORS, errors});
const removeLoginErrors = () => ({type: REMOVE_LOGIN_ERRORS});

/**
 * @type function
 * @description define async action creator
 **/
const loginAction = payload => {
    return dispatch => {
        login(payload).then(({expires_at, access_token}) => {
            setToken(access_token);
            setExpireAt(expires_at);
            dispatch(storeToken(access_token));
        }).catch(({response}) => {
            if (parseInt(response.status) === 403) {
                let errors = Object.keys(response.data.errors).reduce((current, next) => {
                    return {...current,[next]: response.data.errors[next].join('')}
                }, {overall: null});
                dispatch(storeLoginErrors(errors));
            }
        })
    }
};

const meAction = () => {
    return dispatch => {
        me().then(({data}) => {
            console.log(data);
        }).catch(error => {
            console.log(error.response);
        })
    }
};

export {
    STORE_TOKEN,
    STORE_EXPIRE_AT,
    STORE_LOGIN_ERRORS,
    STORE_AUTH_INFO,
    REMOVE_LOGIN_ERRORS,
    REMOVE_EXPIRE_AT,
    REMOVE_TOKEN,
    REMOVE_AUTH_INFO,
    storeAuthInfo,
    setExpireAt,
    setToken,
    storeToken,
    storeExpireAt,
    storeLoginErrors,
    removeAuthInfo,
    removeExpireAt,
    removeLoginErrors,
    removeToken,
    loginAction,
    meAction
}