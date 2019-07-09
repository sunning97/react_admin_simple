import React from 'react';
import PropTypes from 'prop-types';
import {Dropdown, DropdownMenu, DropdownToggle} from "reactstrap";
import toggle from '../../../hooks/toggle';
function HeaderUserDropdown({authInfo, logout}) {
    const [state,changeState] = toggle(false);

    const fullName = () => {
        const {f_name ,l_name} = authInfo;
        return `${f_name? f_name : ''} ${l_name ? l_name : ''}`;
    };
    const avatar = () => {
        const {avatar} = authInfo;
        return avatar ? avatar : '';
    };

    return (
        <li className="dropdown dropdown-user">
            <Dropdown
                isOpen={state}
                toggle={changeState}
                tag='a'
                className="nav-link dropdown-toggle link">
                <DropdownToggle tag='span' caret>
                    <span>{fullName()}</span>
                    <img src={avatar()} alt={fullName()}/>
                </DropdownToggle>
                <DropdownMenu tag='div'
                              className="dropdown-menu dropdown-arrow dropdown-menu-right admin-dropdown-menu">
                    <div className="dropdown-arrow"/>
                    <div className="dropdown-header">
                        <div className="admin-avatar">
                            <img src={avatar()} alt={fullName()}/>
                        </div>
                        <div>
                            <h5 className="font-strong text-white">{fullName()}</h5>
                            <div>
                                <span className="admin-badge mr-3"><i className="ti-alarm-clock mr-2"/>30m.</span>
                                <span className="admin-badge"><i className="ti-lock mr-2"/>Safe Mode</span>
                            </div>
                        </div>
                    </div>
                    <div className="admin-menu-features">
                            <span className="admin-features-item"><i className="ti-user"/>
                                <span>PROFILE</span>
                            </span>
                        <span className="admin-features-item"><i className="ti-support"/>
                                <span>SUPPORT</span>
                            </span>
                        <span className="admin-features-item"><i className="ti-settings"/>
                                <span>SETTINGS</span>
                            </span>
                    </div>
                    <div className="admin-menu-content">
                        <div className="text-muted mb-2">Your Wallet</div>
                        <div><i className="ti-wallet h1 mr-3 text-light"/>
                            <span className="h1 text-success"><sup>$</sup>12.7k</span>
                        </div>
                        <div className="d-flex justify-content-between mt-2">
                            <span className="text-muted">Earnings history</span>
                            <span className="d-flex align-items-center" href="#" onClick={logout}>
                                    Logout<i className="ti-shift-right ml-2 font-20"/>
                                </span>
                        </div>
                    </div>
                </DropdownMenu>
            </Dropdown>
        </li>
    );
}

HeaderUserDropdown.propTypes = {
    authInfo: PropTypes.object,
    logout: PropTypes.func.isRequired
};
export default HeaderUserDropdown;