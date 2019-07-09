import React, {useEffect, useState} from 'react'
import { connect } from 'react-redux';
import Helpers from '../../utils/helpers';
import { hideLoading, showLoading, storeActiveMenu, storeActiveParentMenu } from '../../store/actions/MainActions';
import { getApiPath } from '../../api/sidebar';
import { store } from '../../api/sliders';
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import Auxiliary from "../../components/hoc/Auxiliary";
import SliderForm from "../../components/form/SliderForm";

function Create(props) {
    const { breadcrumbs, meta, location, history, showLoading, hideLoading, storeActiveMenu, storeActiveParentMenu } = props;
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
        const tmpData = { ...data };
        Object.keys(tmpData).forEach(key => tmpData[key] === null && delete tmpData[key]);
        let formData = new FormData();
        for (let key in tmpData) {
            key === 'image' ? formData.append(key, tmpData[key], tmpData[key].name) : formData.append(key, tmpData[key]);
        }
        store(formData)
            .then(response => {
                Helpers.showToast('success', response.message);
                const redirectPath = (location.state && location.state.from) ? location.state.from : '/sliders';
                history.push(redirectPath);
            })
            .catch(error => {
                const status = error.status;
                if(status === 403){
                    let errors = Object.keys(error.data.data).reduce((current,next)=>{
                        return {...current,[next]:error.data.data[next].join(', ')}
                    },{});
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
                breadcrumbs={breadcrumbs} />
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <BoxHead title={meta.title}>
                        <div
                            onClick={navigateTo.bind(this, '/sliders')}
                            className="btn btn-gradient-peach btn-rounded btn-fix">
                            <i className={'ti-back-left mr-2'} />
                            Quay lại
                        </div>
                    </BoxHead>
                    <div className="ibox-body">
                        <SliderForm errors={errors} submit={handleSubmitForm} />
                    </div>
                </div>
            </div>
        </Auxiliary>
    )
}

const mapDispatchToProps = dispatch => ({
    storeActiveMenu: menu => dispatch(storeActiveMenu(menu)),
    storeActiveParentMenu: menu => dispatch(storeActiveParentMenu(menu)),
    showLoading: () => dispatch(showLoading()),
    hideLoading: () => dispatch(hideLoading())
});
export default connect(null, mapDispatchToProps)(Create);