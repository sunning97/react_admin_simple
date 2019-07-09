import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';
import classNames from 'classnames';
import equal from 'deep-equal';

class Sidebar extends React.Component {
    navigate = (path) => {
        const pathname = this.props.location.pathname;
        if (path !== pathname && this.props.history)
            this.props.history.push(path);
    };
    handleClick = (menu, canNavigate, event) => {
        if (canNavigate) {
            this.navigate(menu.api_path);
            return false;
        }
        const parentLi = $(event.target).closest('.parent-li');
        const nav2Level = parentLi.find('.nav-2-level');
        const nav3Level = parentLi.find('.nav-3-level');
        if (nav2Level.length === 0) {
            if (parentLi.hasClass('active')) {
                parentLi.removeClass('active');
                nav3Level.removeAttr('style');
            } else {
                parentLi.addClass('active');
                nav3Level.css({height: 'auto'})
            }
        } else {
            if (parentLi.hasClass('active')) {
                parentLi.removeClass('active');
                nav2Level.removeAttr('style');
            } else {
                parentLi.addClass('active');
                nav2Level.css({height: 'auto'})
            }
        }
    };
     /* eslint-disable */
    generateMenus = (data, level = 2) => {
        return data.map(menu =>  {
            const  hasChildren = (menu.children && menu.children.length);
            return (
                menu.status === 'show' ?
                <li
                    className={classNames(
                        'parent-li',
                        {active: this.props.activeParentMenu === menu.api_path}
                    )}
                    key={menu.id}>
                    <a
                        href="javascript:void(0)"
                        onClick={
                            this.handleClick.bind(
                                this,
                                menu,
                                !hasChildren
                            )}
                        className={classNames({
                            active: menu.children && menu.children.length === 0 && this.props.activeMenu === menu.api_path
                        })}>
                        {level < 3 && <i className={`sidebar-item-icon ${menu.icon}`}/>}
                        <span className="nav-label">{menu.name}</span>
                        {hasChildren ? <i className="fa fa-angle-left arrow"/> : null}
                    </a>
                    {
                        hasChildren ?
                            <ul
                                className={classNames(
                                    `nav-${level}-level collapsing`,
                                    {in: this.props.activeParentMenu === menu.api_path})}
                                style={this.props.activeParentMenu === menu.api_path ? {height: 'auto'} : {}}>
                                {hasChildren ? this.generateMenus(menu.children, level + 1) : null}
                            </ul>
                            : null
                    }
                </li> : null
            )
        })
    };
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const {
            activeMenu,
            activeParentMenu,
            menuData
        } = this.props;
        return nextProps.activeMenu !== activeMenu ||
            nextProps.activeParentMenu !== activeParentMenu ||
            !equal(menuData,nextProps.menuData);
    }
    render() {
        const {
            menuData
        } = this.props;
        return (
            <nav className="page-sidebar" id="sidebar">
                <div id="sidebar-collapse">
                    <ul className="side-menu">
                        {this.generateMenus(menuData)}
                    </ul>
                </div>
            </nav>
        )
    }
}

const mapStateTopProps = state => {
    const {
        activeMenu,
        activeParentMenu,
        menuData
    } = state.main;
    return {
        activeMenu,
        activeParentMenu,
        menuData
    }
};

export default connect(mapStateTopProps)(Sidebar);