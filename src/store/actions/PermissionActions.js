export const storeCurrentTablePage = (page) => {
    return {
        type: 'PERMISSION_STORE_CURRENT_TABLE_PAGE',
        page
    }
};

export const storePerPage = (perPage) => {
    return {
        type: 'PERMISSION_STORE_PER_PAGE',
        perPage
    }
};

export const storeColumnsTitle = (columnsTitle)=> {
    return {
        type: 'PERMISSION_STORE_COLUMNS_TITLE',
        columnsTitle
    }
};