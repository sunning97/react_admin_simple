import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
    showLoading,
    hideLoading,
    storeActiveMenu,
    storeActiveParentMenu
} from '../../store/actions/MainActions';
import { getApiPath } from '../../api/sidebar';
import { edit, update } from '../../api/partners';
import Helpers from '../../utils/helpers';
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import Auxiliary from "../../components/hoc/Auxiliary";
import PartnerForm from "../../components/form/PartnerForm";

function Edit(props) {
    const {
        history,
        match,
        location,
        showLoading,
        breadcrumbs,
        meta,
        hideLoading,
        storeActiveMenu,
        storeActiveParentMenu
    } = props;
    const [partner, setPartner] = useState(null);
    const [title, setTitle] = useState(meta.title);
    const [errors,setErrors] = useState(null);
    const fetchData = async () => {
        const resApiPath = await getApiPath(meta.apiPath);
        const resPartner = await edit(match.params.id);
        return Promise.all([resApiPath, resPartner]);
    };
    const navigateTo = path => history.push(path);
    const resolvePath = () => (location.state && location.state.from) ? location.state.from : '/partners';
    const handleSubmit = event => {
        event.preventDefault();
        showLoading();
        const formData = new FormData(event.target);
        update(partner.id, formData)
            .then(({ message }) => {
                Helpers.showToast('success', message, 1500);
                navigateTo(resolvePath());
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
        fetchData()
            .then(fullFill => {
                const apiPath = fullFill[0].data;
                const partner = fullFill[1].data;
                setTitle(`${title} #${partner.id}`);
                setPartner(partner);
                Helpers.changeAppTitle(`${title} #${partner.id}`);
                if (apiPath) {
                    storeActiveMenu(apiPath.api_path);
                    storeActiveParentMenu(apiPath.parent ? apiPath.parent.api_path : null);
                }
                Helpers.scrollToTop();
                hideLoading();
            })
            .catch(error => {
                Helpers.feedback(error, hideLoading)
            })
    }, []);
    return (
        <Auxiliary>
            <PageHeading
                title={title}
                breadcrumbs={breadcrumbs} />
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <BoxHead>
                        <div
                            onClick={navigateTo.bind(this, resolvePath())}
                            className="btn btn-gradient-peach btn-rounded btn-fix">
                            <i className={'ti-back-left mr-2'} />
                            Quay lại
                        </div>
                    </BoxHead>
                    <div className="ibox-body">
                        <PartnerForm errors={errors} data={partner} submit={handleSubmit} />
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
export default connect(null, mapDispatchToProps)(Edit);