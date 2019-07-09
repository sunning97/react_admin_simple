import React from 'react';
const SearchBar = () => (
        <form className="search-top-bar">
            <input className="form-control search-input" type="text" placeholder="Nhập để tìm..."/>
            <button className="reset input-search-icon"><i className="ti-search"/></button>
            <button className="reset input-search-close" type="button"><i className="ti-close"/></button>
        </form>);
export default SearchBar;