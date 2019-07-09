import React from 'react';
import {Dropdown} from "react-bootstrap";
import CustomToggle from "./bootstrap/customs/CustomToggle";
import PropTypes from 'prop-types';

const TableActionsDropdown = props =>(
    <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
            <i className="ti-menu"/>
        </Dropdown.Toggle>
        {
            props.actions
        }
    </Dropdown>
);
TableActionsDropdown.propTypes = {
    actions: PropTypes.object.isRequired
};
export default TableActionsDropdown;