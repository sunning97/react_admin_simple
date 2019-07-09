import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {
    hideLoading,
    showLoading,
    storeActiveMenu,
    storeActiveParentMenu
} from '../../store/actions/MainActions';
import {edit, update} from '../../api/categories';
import Helpers from '../../utils/helpers';
import Auxiliary from "../../components/hoc/Auxiliary";
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import CategoryForm from "../../components/form/CategoryForm";
import {getApiPath} from "../../api/sidebar";

function Edit(props) {
    const {
        meta,
        match,
        location,
        history,
        showLoading,
        hideLoading,
        breadcrumbs,
        storeActiveMenu,
        storeActiveParentMenu
    } = props;
    const [category, setCategory] = useState(null);
    const [errors,setErrors] = useState(null);
    const redirect = '/categories';
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
        update(category.id, tmpData)
            .then(response => {
                Helpers.showToast('success', response.message, 1500);
                const redirectPath = location.state && location.state.from ?
                    location.state.from :
                    redirect;
                history.push(redirectPath);
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
    const fetchData = async (id, apiPath) => {
        const resApiPath = await getApiPath(apiPath);
        const resEdit = await edit(id);
        return Promise.all([resApiPath, resEdit]);
    };
    useEffect(()=>{
        fetchData(match.params.id, meta.apiPath)
            .then(fullFill => {
                const category = fullFill[1].data;
                const apiPath = fullFill[0].data;
                setCategory(category);
                Helpers.changeAppTitle(`${meta.title} #${category.id}`);
                if(apiPath){
                    storeActiveMenu(apiPath.api_path);
                    storeActiveParentMenu(apiPath.parent ? apiPath.parent.api_path : null)
                }
                hideLoading();
                Helpers.scrollToTop();
            })
            .catch(error => {
                Helpers.feedback(error, hideLoading)
            });
    },[]);

    return (
        <Auxiliary>
            <PageHeading
                title={`${meta.title} #${category && category.id}`}
                breadcrumbs={breadcrumbs}/>
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <BoxHead>
                        <div
                            onClick={navigateTo.bind(this, redirect)}
                            className="btn btn-gradient-peach btn-rounded btn-fix">
                            <i className={'ti-back-left mr-2'}/>
                            Quay lại
                        </div>
                    </BoxHead>
                    <div className="ibox-body">
                        <CategoryForm
                            errors={errors}
                            data={category}
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
export default connect(null, mapDispatchToProps)(Edit);