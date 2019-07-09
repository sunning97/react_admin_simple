const initState = {
    auth: {
        token: null,
        info: null,
    },
    apiBaseUrl: 'http://simpleadminapi.io/api/',
    activeMenu: '',
    activeParentMenu: '',
    menuData: [],
    isLoading: false
};
const MainReducer = (state = initState, action) => {
    switch (action.type) {
        case 'STORE_TOKEN':{
            return {
                ...state,
                auth: {
                    ...state.auth,
                    token: action.token
                }
            };
        }
        case 'REMOVE_TOKEN':{
            return {
                ...state,
                token: null
            }
        }
        case 'STORE_USER':{
            return {
                ...state,
                auth: {
                    ...state.auth,
                    info: action.user
                }
            }
        }
        case 'STORE_ACTIVE_MENU': {
            return {
                ...state,
                activeMenu: action.menu
            }
        }
        case 'STORE_ACTIVE_PARENT_MENU':{
            return {
                ...state,
                activeParentMenu: action.menu
            }
        }
        case 'STORE_APP_MENU':{
            return {
                ...state,
                menuData: action.data
            }
        }
        case 'SHOW_LOADING': {
            return {
                ...state,
                isLoading: true
            }
        }
        case 'HIDE_LOADING': {
            return {
                ...state,
                isLoading: false
            }
        }
        default: {
            return state;
        }
    }
};

export default MainReducer;