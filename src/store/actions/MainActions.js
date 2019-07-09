export const storeActiveMenu = menu => ({type: 'STORE_ACTIVE_MENU', menu});
export const storeActiveParentMenu = menu => ({type: 'STORE_ACTIVE_PARENT_MENU', menu});
export const storeAppMenu = data => ({type: 'STORE_APP_MENU', data});
export const showLoading = ()=> ({type: 'SHOW_LOADING'});
export const hideLoading = () => ({type: 'HIDE_LOADING'});