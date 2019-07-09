import {
    REMOVE_AUTH_INFO,
    REMOVE_TOKEN,
    REMOVE_EXPIRE_AT,
    REMOVE_LOGIN_ERRORS,
    STORE_AUTH_INFO,
    STORE_LOGIN_ERRORS,
    STORE_EXPIRE_AT,
    STORE_TOKEN
} from '../actions/AuthActions';

const initState = {
    token: null,
    expireAt: null,
    info: null,
    loginErrors: {
        email: null,
        password:null,
        overall: null
    }
};

const AuthReducer = (state = initState, action) => {
    switch (action.type) {
        case STORE_TOKEN: {
            return  {
                ...state,
                token: action.token
            }
        }
        case STORE_EXPIRE_AT: {
            return  {
                ...state,
                expire_at: action.time
            }
        }
        case STORE_AUTH_INFO: {
            return  {
                ...state,
                info: action.info
            }
        }
        case STORE_LOGIN_ERRORS: {
            return  {
                ...state,
                loginErrors: action.errors
            }
        }
        case REMOVE_TOKEN:{
            return  {
                ...state,
                token:null
            }
        }
        case REMOVE_LOGIN_ERRORS: {
            return {
                ...state,
                loginErrors: {
                    email: null,
                    password:null,
                    overall: null
                }
            }
        }
        case REMOVE_EXPIRE_AT:{
            return  {
                ...state,
                expireAt: null
            }
        }
        case REMOVE_AUTH_INFO: {
            return  {
                ...state,
                info : null
            }
        }
        default:{
        }
    }
    return state;
};

export default AuthReducer;