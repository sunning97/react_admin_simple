import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {
    hideLoading,
    showLoading,
    storeActiveMenu,
    storeActiveParentMenu
} from '../../store/actions/MainActions';
import {getApiPath} from '../../api/sidebar';
import {store} from '../../api/tags';
import Helpers from '../../utils/helpers';
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import Auxiliary from "../../components/hoc/Auxiliary";
import TagForm from "../../components/form/TagForm";
import toggle from '../../hooks/toggle';

function Create(props) {
    const {
        history,
        location,
        showLoading,
        hideLoading,
        meta,
        breadcrumbs,
        storeActiveMenu,
        storeActiveParentMenu
    } = props;
    const [clear, setClear] = toggle();
    const [errors, setErrors] = useState(null);
    const navigateTo = path => history.push(path);

    const handleSubmitForm = (data, event) => {
        event.preventDefault();
        showLoading();
        const tmpData = {...data};
        Object.keys(tmpData).forEach(key => tmpData[key] === null && delete tmpData[key]);
        store(tmpData)
            .then(response => {
                Helpers.showToast('success', response.message, 1500);
                if (tmpData.stayHere) {
                    setClear(!clear);
                    hideLoading();
                } else {
                    const redirectPath = location.state && location.state.from ?
                        location.state.from :
                        '/tags';
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
            .then(({data}) => {
                Helpers.changeAppTitle(meta.title);
                if (data) {
                    storeActiveMenu(data.api_path);
                    storeActiveParentMenu(data.parent ? data.parent.api_path : null);
                }
                hideLoading();
                Helpers.scrollToTop();
            })
            .catch(error => {
                Helpers.feedback(error, hideLoading)
            });
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
                            onClick={navigateTo.bind(this, '/tags')}
                            className="btn btn-gradient-peach btn-rounded btn-fix">
                            <i className={'ti-back-left mr-2'}/>
                            Quay lại
                        </div>
                    </BoxHead>
                    <div className="ibox-body">
                        <TagForm
                            errors={errors}
                            addStayHere={true}
                            isClear={clear}
                            submit={handleSubmitForm}/>
                    </div>
                </div>
            </div>
        </Auxiliary>
    );
}

const mapDispatchToProps = dispatch => ({
    storeActiveParentMenu: menu => dispatch(storeActiveParentMenu(menu)),
    storeActiveMenu: menu => dispatch(storeActiveMenu(menu)),
    hideLoading: () => dispatch(hideLoading()),
    showLoading: () => dispatch(showLoading())
});
export default connect(null, mapDispatchToProps)(Create);