import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import Helpers from '../../utils/helpers';
import {
    hideLoading,
    showLoading,
    storeActiveMenu,
    storeActiveParentMenu,
    storeAppMenu
} from '../../store/actions/MainActions';
import {editMenuType, storeMenu} from '../../api/menus';
import {getApiPath,getSideBar} from '../../api/sidebar';
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import Auxiliary from "../../components/hoc/Auxiliary";
import MenuForm from "../../components/form/MenuForm";
import {sidebarID} from '../../utils/default-settings';

function CreateMenu(props) {
    const {
        history,
        showLoading,
        hideLoading,
        storeAppMenu,
        meta,
        breadcrumbs,
        match,
        storeActiveMenu,
        storeActiveParentMenu
    } = props;
    const [menuType, setMenuType] = useState(null);
    const [errors, setErrors] = useState(null);
    const navigateTo = path => history.push(path);
    const isSidebar = () => menuType.id === sidebarID;
    const fetchData = async () => {
        try {
            const responsePath = await getApiPath(meta.apiPath);
            const responseMenu = await editMenuType(match.params.id);
            return Promise.all([responsePath, responseMenu])
        } catch (e) {
            return Promise.reject(e);
        }
    };
    const handleSubmit = async (data, event) => {
        event.preventDefault();
        showLoading();
        const tmp = {...data, menu_type_id: menuType.id};
        try {
            const resStore = await storeMenu(tmp);
            const resMenus = await isSidebar() ? getSideBar() : null;
            Promise.all([resStore, resMenus])
                .then(fullFill => {
                    const {message} = fullFill[0];
                    const {data} = fullFill[1];
                    Helpers.showToast('success', message, 1500);
                    if (isSidebar()) storeAppMenu(data);
                    history.push(`/menu-builder/builder/${menuType.id}`);
                })
        } catch (error) {
            const status = error.status;
            if (status === 403) {
                let errors = Object.keys(error.data.data).reduce((current, next) => {
                    return {...current, [next]: error.data.data[next].join(', ')}
                }, {});
                setErrors(errors);
            } else {
                Helpers.feedback(error)
            }
            hideLoading();
        }
    };

    useEffect(() => {
        fetchData().then(
            fullFill => {
                Helpers.changeAppTitle(meta.title);
                const apiPath = fullFill[0].data;
                const menuType = fullFill[1].data;
                setMenuType(menuType);
                if (apiPath) {
                    storeActiveMenu(apiPath.api_path);
                    storeActiveParentMenu(apiPath.parent ? apiPath.parent.api_path : null)
                }
                hideLoading();
            },
            error => {
                Helpers.feedback(error, hideLoading)
            })
    }, []);

    return (
        <Auxiliary>
            <PageHeading
                breadcrumbs={breadcrumbs}
                title={meta.title}/>
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <BoxHead>
                        {
                            menuType && <div
                                onClick={navigateTo.bind(this, `/menu-builder/builder/${menuType.id}`)}
                                className="btn btn-gradient-peach btn-rounded btn-fix">
                                <i className={'ti-back-left mr-2'}/>
                                Quay lại
                            </div>
                        }
                    </BoxHead>
                    <div className="ibox-body">
                        <MenuForm errors={errors} submit={handleSubmit}/>
                    </div>
                </div>
            </div>
        </Auxiliary>
    );
}

const mapDispatchToProps = dispatch => ({
    storeActiveMenu: menu => dispatch(storeActiveMenu(menu)),
    storeActiveParentMenu: menu => dispatch(storeActiveParentMenu(menu)),
    hideLoading: () => dispatch(hideLoading()),
    showLoading: () => dispatch(showLoading()),
    storeAppMenu: menus => dispatch(storeAppMenu(menus))
});
export default connect(null, mapDispatchToProps)(CreateMenu);