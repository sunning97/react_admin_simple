import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import Helpers from '../../../utils/helpers';
import { hideLoading, showLoading } from '../../../store/actions/MainActions';
import { removeToken } from '../../../store/actions/AuthActions';
import { removeToken as removeTokenUtils, removeExpireAt } from '../../../utils/auth';
import { logout } from '../../../api/auth';
import HeaderUserDropdown from "./HeaderUserDropdown";

function Index(props) {
    const { hideLoading, showLoading, removeToken, history, info } = props;
    useEffect(() => {
        const body = document.getElementsByTagName('body')[0];
        const jsSidebarToggler = document.getElementsByClassName('js-sidebar-toggler')[0];
        const jsSearchToggler = document.getElementsByClassName('js-search-toggler')[0];
        const searchTopBar = document.getElementsByClassName('search-top-bar')[0];
        const inputSearchClose = document.getElementsByClassName('input-search-close')[0];
        const backdrop = document.getElementsByClassName('backdrop')[0];
        body.classList.remove('body-login');
        jsSidebarToggler.addEventListener('click', event => {
            event.preventDefault();
            body.classList.contains('sidebar-mini') ?
                body.classList.remove('sidebar-mini') :
                body.classList.add('sidebar-mini');
        });
        jsSearchToggler.addEventListener('click', event => {
            event.preventDefault();
            searchTopBar.classList.add('shined');
            backdrop.classList.add('has-backdrop');
        });
        inputSearchClose.addEventListener('click', event => {
            event.preventDefault();
            searchTopBar.classList.remove('shined');
            backdrop.classList.remove('has-backdrop');
        });
        backdrop.addEventListener('click', event => {
            event.preventDefault();
            if (backdrop.classList.contains('has-backdrop') && searchTopBar.classList.contains('shined')) {
                searchTopBar.classList.remove('shined');
                backdrop.classList.remove('has-backdrop');
            }
        });
    }, []);

    const handleLogout = event => {
        event.preventDefault();
        showLoading();
        logout()
            .then(() => {
                removeTokenUtils();
                removeToken();
                removeExpireAt();
                history.push('/login');
            }).catch(error => {
                Helpers.feedback(error, hideLoading)
            });
    };
    return (
        <header className="header">
            <div className="page-brand">
                <NavLink to={'/'}>
                    <span className="brand">AdminCa</span>
                    <span className="brand-mini">AC</span>
                </NavLink>
            </div>
            <div className="flexbox flex-1">
                <ul className="nav navbar-toolbar">
                    <li>
                        <span style={{ cursor: 'pointer' }} className="nav-link sidebar-toggler js-sidebar-toggler">
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </span>
                    </li>
                    <li>
                        <span className="nav-link search-toggler js-search-toggler"><i className="ti-search" />
                            <span>Tìm kiếm...</span>
                        </span>
                    </li>
                </ul>
                <ul className="nav navbar-toolbar">
                    <HeaderUserDropdown authInfo={info} logout={handleLogout} />
                </ul>
            </div>
        </header>
    )
}

const mapStateToProps = state => ({ info: state.auth.info });
const mapDispatchToProps = dispatch => ({
    removeToken: () => dispatch(removeToken()),
    hideLoading: () => dispatch(hideLoading()),
    showLoading: () => dispatch(showLoading())
});
export default connect(mapStateToProps, mapDispatchToProps)(Index)