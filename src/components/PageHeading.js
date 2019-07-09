import React from 'react';
import {NavLink} from "react-router-dom";
import PropTypes from 'prop-types';
const PageHeading = ({title = '',breadcrumbs= []}) => (
    <div className="page-heading fade-in-up">
        <h1 className="page-title">{title}</h1>
        <ol className="breadcrumb font-bold">
            <li className="breadcrumb-item">
                <NavLink to={'/'}><i className="ti-home font-20"/></NavLink>
            </li>
            {
                breadcrumbs.map(({path, title},index)=>(
                    (index === breadcrumbs.length -1) ?
                        <li className="breadcrumb-item" key={index}>
                            {title}
                        </li> :
                        <li className="breadcrumb-item" key={index}>
                            <NavLink to={path}>{title}</NavLink>
                        </li>
                ))
            }
        </ol>
    </div>
);

PageHeading.propTypes = {
    title: PropTypes.string.isRequired,
    breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
        path: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
    }))
};

export default PageHeading;