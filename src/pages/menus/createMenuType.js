import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {
    hideLoading,
    showLoading,
    storeActiveMenu,
    storeActiveParentMenu
} from '../../store/actions/MainActions';
import {getApiPath} from '../../api/sidebar';
import {storeMenuType} from '../../api/menus';
import Helpers from '../../utils/helpers';
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import Auxiliary from "../../components/hoc/Auxiliary";
import MenuTypeForm from "../../components/form/MenuTypeForm";

function CreateMenuType(props) {
    const {
        meta,
        showLoading,
        hideLoading,
        history,
        breadcrumbs,
        storeActiveParentMenu,
        storeActiveMenu
    } = props;
    const [errors, setErrors] = useState(null);
    const navigateTo = path => history.push(path);
    const handleSubmit = (data, event) => {
        event.preventDefault();
        showLoading();
        storeMenuType(data).then(
            response => {
                Helpers.showToast('success', response.message);
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
        getApiPath(meta.apiPath).then(
            ({data}) => {
                Helpers.changeAppTitle(meta.title);
                if (data) {
                    storeActiveMenu(data.api_path);
                    storeActiveParentMenu(data.parent ? data.parent.api_path : null);
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
                    <BoxHead title={meta.title}>
                        <div
                            onClick={navigateTo.bind(this, '/menu-builder')}
                            className="btn btn-gradient-peach btn-rounded btn-fix">
                            <i className={'ti-back-left mr-2'}/>
                            Quay lại
                        </div>
                    </BoxHead>
                    <div className="ibox-body">
                        <MenuTypeForm errors={errors} submit={handleSubmit}/>
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
export default connect(null, mapDispatchToProps)(CreateMenuType);