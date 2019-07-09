import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import Helpers from '../../utils/helpers';
import {
    storeActiveMenu,
    storeActiveParentMenu,
    showLoading,
    hideLoading
} from '../../store/actions/MainActions';
import {getApiPath} from '../../api/sidebar';
import {store} from '../../api/roles';
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import Auxiliary from "../../components/hoc/Auxiliary";
import RoleForm from "../../components/form/RoleForm";

function Create(props) {
    const {
        meta,
        hideLoading,
        showLoading,
        storeActiveMenu,
        storeActiveParentMenu,
        history,
        breadcrumbs
    } = props;
    const [errors, setErrors] = useState(null);
    const navigateTo = path => {
        history.push(path);
    };
    const handleSubmit = (data, event) => {
        event.preventDefault();
        showLoading();
        store(data).then(
            response => {
                Helpers.showToast('success', response.message, 1500);
                navigateTo('/roles')
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
        getApiPath(meta.apiPath)
            .then(({data}) => {
                Helpers.changeAppTitle(meta.title);
                if (data) {
                    storeActiveMenu(data.api_path);
                    storeActiveParentMenu(data.parent ? data.parent.api_path : null);
                }
                hideLoading();
            })
            .catch(error => {
                Helpers.feedback(error, hideLoading)
            });
    });
    return (
        <Auxiliary>
            <PageHeading
                title={meta.title}
                breadcrumbs={breadcrumbs}/>
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <BoxHead>
                        <div
                            onClick={navigateTo.bind(this, '/roles')}
                            className="btn btn-gradient-peach btn-rounded btn-fix">
                            <i className={'ti-back-left mr-2'}/>
                            Quay lại
                        </div>
                    </BoxHead>
                    <div className="ibox-body">
                        <RoleForm errors={errors} submit={handleSubmit}/>
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
    showLoading: () => dispatch(showLoading())
});
export default connect(null, mapDispatchToProps)(Create);