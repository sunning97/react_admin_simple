import JSCookie from 'js-cookie';

/**
 * @type string
 * @description define token key store in cookie
 **/
const tokenKey = 'token';


/**
 * @type string
 * @description define expire_at key store in cookie
 **/
const expireAtKey = 'expire_at';

export const getToken = () => JSCookie.get(tokenKey);
export const setToken = token => JSCookie.set(tokenKey,token);
export const removeToken = () => JSCookie.remove(tokenKey);
export const setExpireAt = time => JSCookie.set(expireAtKey,time);
export const getExpireAt = () => JSCookie.get(expireAtKey);
export const removeExpireAt = () => JSCookie.remove(expireAtKey);