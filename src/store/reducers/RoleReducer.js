const initState = {
    currentTablePage: 1,
    perPage: 10,
    columnsTitle: null,
};

const RoleReducer = (state = initState, action) => {
    switch (action.type) {
        case 'ROLE_STORE_CURRENT_TABLE_PAGE': {
            return {
                ...state,
                currentTablePage: action.page
            }
        }
        case 'ROLE_STORE_PER_PAGE': {
            return {
                ...state,
                perPage: action.perPage
            };
        }
        case 'ROLE_STORE_COLUMNS_TITLE': {
            return {
                ...state,
                columnsTitle: action.columnsTitle
            }
        }
        default:{
            
        }
    }
    return state;
};

export default RoleReducer;
