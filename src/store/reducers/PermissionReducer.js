const initState = {
    currentTablePage: 1,
    perPage: 10,
    columnsTitle:null
};

const BrandReducer = (state = initState, action) => {
    switch (action.type) {
        case 'PERMISSION_STORE_CURRENT_TABLE_PAGE':{
            return {
                ...state,
                currentTablePage: action.page
            };
        }
        case 'PERMISSION_STORE_PER_PAGE':{
            return {
                ...state,
                perPage: action.perPage
            };
        }
        case 'PERMISSION_STORE_COLUMNS_TITLE':{
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

export default BrandReducer;
