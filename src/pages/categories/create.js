import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {
    hideLoading,
    showLoading,
    storeActiveMenu,
    storeActiveParentMenu
} from '../../store/actions/MainActions';
import {getApiPath} from '../../api/sidebar';
import {store} from '../../api/categories';
import Helpers from '../../utils/helpers';
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import Auxiliary from "../../components/hoc/Auxiliary";
import CategoryForm from "../../components/form/CategoryForm";

function Create(props) {
    const {
        location,
        history,
        showLoading,
        hideLoading,
        meta,
        breadcrumbs,
        storeActiveMenu,
        storeActiveParentMenu
    } = props;
    const [clear, setClear] = useState(false);
    const [errors,setErrors] = useState(null);
    const navigateTo = path => {
        const redirectPath = location.state && location.state.from ?
            location.state.from :
            path;
        history.push(redirectPath);
    };

    const handleSubmitForm = (data, event) => {
        event.preventDefault();
        showLoading();
        const tmpData = {...data};
        Object.keys(tmpData).forEach(key => tmpData[key] === null && delete tmpData[key]);
        store(tmpData)
            .then(response => {
                Helpers.showToast('success', response.message, 1500);
                if (tmpData.stayHere) {
                    hideLoading();
                    setClear(!clear);
                } else {
                    const redirectPath = location.state && location.state.from ?
                        location.state.from :
                        '/categories';
                    history.push(redirectPath);
                }
            })
            .catch(error => {
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
            });
    };

    useEffect(() => {
        getApiPath(meta.apiPath)
            .then(response => {
                Helpers.changeAppTitle(meta.title);
                const apiPath = response.data;
                if (apiPath) {
                    storeActiveMenu(apiPath.api_path);
                    storeActiveParentMenu(apiPath.parent ? apiPath.parent.api_path : null);
                }
                hideLoading();
            })
            .catch(error => {
                Helpers.feedback(error, hideLoading)
            })
    }, []);
    return (
        <Auxiliary>
            <PageHeading
                title={meta.title}
                breadcrumbs={breadcrumbs}/>
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <BoxHead>
                        <div
                            onClick={navigateTo.bind(this, '/categories')}
                            className="btn btn-gradient-peach btn-rounded btn-fix">
                            <i className={'ti-back-left mr-2'}/>
                            Quay lại
                        </div>
                    </BoxHead>
                    <div className="ibox-body">
                        <CategoryForm
                            isAddStayHere={true}
                            clear={clear}
                            errors={errors}
                            submit={handleSubmitForm}/>
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