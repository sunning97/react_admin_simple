export const storeCurrentTablePage = (page) => {
    return {
        type: 'ROLE_STORE_CURRENT_TABLE_PAGE',
        page
    }
};

export const storePerPage = (perPage) => {
    return {
        type: 'ROLE_STORE_PER_PAGE',
        perPage
    }
};

export const storeColumnsTitle = (columnsTitle)=> {
    return {
        type: 'ROLE_STORE_COLUMNS_TITLE',
        columnsTitle
    }
};