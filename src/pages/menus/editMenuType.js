import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Helpers from '../../utils/helpers';
import {
    hideLoading,
    showLoading,
    storeActiveMenu,
    storeActiveParentMenu
} from '../../store/actions/MainActions';
import {editMenuType, updateMenuType} from '../../api/menus';
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import Auxiliary from "../../components/hoc/Auxiliary";
import MenuTypeForm from "../../components/form/MenuTypeForm";
import {getApiPath} from "../../api/sidebar";

function EditMenuType(props) {
    const {
        meta,
        history,
        match,
        breadcrumbs,
        showLoading,
        hideLoading,
        storeActiveParentMenu,
        storeActiveMenu
    } = props;
    const [menuType, setMenuType] = useState(null);
    const [title, setTitle] = useState(meta.title);
    const [errors, setErrors] = useState(null);
    const navigateTo = path => history.push(path);
    const fetchData = async () => {
        try {
            const responsePath = await getApiPath(meta.apiPath);
            const responseMenuType = await editMenuType(match.params.menu_type_id);
            return Promise.all([responsePath, responseMenuType])
        } catch (e) {
            return Promise.reject(e);
        }
    };
    const handleSubmit = (data, event) => {
        event.preventDefault();
        showLoading();
        updateMenuType(menuType.id, data).then(
            response => {
                Helpers.showToast('success', response.message, 1500);
                navigateTo('/menu-builder');
            },
            error => {
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
            })
    };
    useEffect(() => {
        fetchData().then(fullFill => {
                const apiPath = fullFill[0].data;
                const menuType = fullFill[1].data;
                Helpers.changeAppTitle(`${meta.title} #${menuType.id}`);
                setTitle(`${meta.title} #${menuType.id}`);
                setMenuType(menuType);
                if (apiPath) {
                    storeActiveMenu(apiPath.api_path);
                    storeActiveParentMenu(apiPath.parent ? apiPath.parent.api_path : null);
                }
                hideLoading()
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
                    <BoxHead title={title}>
                        <div
                            onClick={navigateTo.bind(this, '/menu-builder')}
                            className="btn btn-gradient-peach btn-rounded btn-fix">
                            <i className={'ti-back-left mr-2'}/>
                            Quay lại
                        </div>
                    </BoxHead>
                    <div className="ibox-body">
                        <MenuTypeForm data={menuType} errors={errors} submit={handleSubmit}/>
                    </div>
                </div>
            </div>
        </Auxiliary>
    );
}

const mapDispatchToProps = dispatch => ({
    storeActiveMenu: menu => dispatch(storeActiveMenu(menu)),
    storeActiveParentMenu: menu => dispatch(storeActiveParentMenu(menu)),
    showLoading: () => dispatch(showLoading()),
    hideLoading: () => dispatch(hideLoading())
});
export default connect(null, mapDispatchToProps)(EditMenuType);