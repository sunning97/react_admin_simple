import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Helpers from '../../utils/helpers';
import {
    hideLoading,
    showLoading,
    storeActiveMenu,
    storeActiveParentMenu,
    storeAppMenu
} from '../../store/actions/MainActions';
import {getApiPath, getSideBar} from '../../api/sidebar';
import {editMenu, editMenuType, updateMenu} from '../../api/menus';
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import Auxiliary from "../../components/hoc/Auxiliary";
import MenuForm from "../../components/form/MenuForm";
import {sidebarID} from '../../utils/default-settings';

function EditMenu(props) {
    const {
        match,
        history,
        meta,
        showLoading,
        hideLoading,
        storeActiveMenu,
        storeActiveParentMenu,
        breadcrumbs,
        storeAppMenu
    } = props;
    const [menuType, setMenuType] = useState(null);
    const [menu, setMenu] = useState(null);
    const [errors, setErrors] = useState(null);
    const navigateTo = path => history.push(path);
    const [title, setTitle] = useState(meta.title);
    const isSidebar = () => sidebarID === menuType.id;
    const fetchData = async () => {
        try {
            const responsePath = await getApiPath(meta.apiPath);
            const responseMenuType = await editMenuType(match.params.menu_type_id);
            const responseMenu = await editMenu(match.params.menu_id);
            return Promise.all([responsePath, responseMenuType, responseMenu]);
        } catch (e) {
            return Promise.reject(e)
        }
    };
    const handleSubmit = async (data, event) => {
        event.preventDefault();
        showLoading();
        try {
            const resUpdate = await updateMenu(menu.id, data);
            const resSidebar = await isSidebar() ? getSideBar() : null;
            Promise.all([resUpdate, resSidebar]).then(fullFill => {
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
                const apiPath = fullFill[0].data;
                const menu = fullFill[2].data;
                const menuType = fullFill[1].data;
                Helpers.changeAppTitle(`${meta.title} #${menu.id}`);
                setTitle(`${meta.title} #${menu.id}`);
                setMenuType(menuType);
                setMenu(menu);
                if (apiPath) {
                    storeActiveMenu(apiPath.api_path);
                    storeActiveParentMenu(apiPath.parent ? apiPath.parent.api_path : null);
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
                title={title}/>
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <BoxHead>
                        {
                            <div
                                onClick={navigateTo.bind(this, `/menu-builder/builder/${menuType && menuType.id}`)}
                                className="btn btn-gradient-peach btn-rounded btn-fix">
                                <i className={'ti-back-left mr-2'}/>
                                Quay lại
                            </div>
                        }
                    </BoxHead>
                    <div className="ibox-body">
                        <MenuForm
                            data={menu}
                            errors={errors}
                            submit={handleSubmit}/>
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
    storeAppMenu: data => dispatch(storeAppMenu(data))
});
export default connect(null, mapDispatchToProps)(EditMenu);