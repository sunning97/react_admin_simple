import React, {useEffect, useState} from 'react'
import { connect } from 'react-redux';
import {
    hideLoading,
    showLoading,
    storeActiveMenu,
    storeActiveParentMenu
} from '../../store/actions/MainActions';
import { getApiPath } from '../../api/sidebar';
import { store } from '../../api/partners';
import Helpers from '../../utils/helpers';
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import Auxiliary from "../../components/hoc/Auxiliary";
import PartnerForm from "../../components/form/PartnerForm";

function Create(props) {
    const {
        showLoading,
        hideLoading,
        history,
        location,
        meta,
        storeActiveMenu,
        storeActiveParentMenu,
        breadcrumbs
    } = props;
    const [errors,setErrors] = useState(null);
    const navigateTo = path => history.push(path);
    const resolvePath = () => (location.state && location.state.from) ? location.state.from : '/partners';
    const handleSubmit = event => {
        event.preventDefault();
        showLoading();
        const formData = new FormData(event.target);
        store(formData)
            .then(({ message }) => {
                Helpers.showToast('success',message,1500);
                navigateTo(resolvePath());
            })
            .catch(error=>{
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
            })
    };
    useEffect(() => {
        getApiPath(meta.apiPath)
            .then(({ data }) => {
                Helpers.changeAppTitle(meta.title);
                if (data) {
                    storeActiveMenu(data.api_path);
                    storeActiveParentMenu(data.parent ? data.parent.api_path : null);
                }
            })
            .catch(error => {
                Helpers.feedback(error, hideLoading)
            })
        hideLoading();
    }, []);
    return (
        <Auxiliary>
            <PageHeading
                title={meta.title}
                breadcrumbs={breadcrumbs} />
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <BoxHead>
                        <div onClick={navigateTo.bind(this, resolvePath())}
                            className="btn btn-gradient-peach btn-rounded btn-fix">
                            <i className={'ti-back-left mr-2'} />
                            Quay lại
                        </div>
                    </BoxHead>
                    <div className="ibox-body">
                        <PartnerForm errors={errors} submit={handleSubmit}/>
                    </div>
                </div>
            </div>
        </Auxiliary>
    )
}
const mapDispatchToProps = dispatch => ({
    hideLoading: () => dispatch(hideLoading()),
    showLoading: () => dispatch(showLoading()),
    storeActiveMenu: menu => dispatch(storeActiveMenu(menu)),
    storeActiveParentMenu: menu => dispatch(storeActiveParentMenu(menu))
});
export default connect(null, mapDispatchToProps)(Create);