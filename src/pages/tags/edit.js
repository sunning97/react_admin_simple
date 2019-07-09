import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {
    hideLoading,
    showLoading,
    storeActiveMenu,
    storeActiveParentMenu
} from '../../store/actions/MainActions';
import {getApiPath} from '../../api/sidebar';
import {edit, update} from '../../api/tags';
import Helpers from '../../utils/helpers';
import Auxiliary from "../../components/hoc/Auxiliary";
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import TagForm from "../../components/form/TagForm";

function Edit(props) {
    const {
        showLoading,
        hideLoading,
        breadcrumbs,
        history,
        match,
        meta,
        storeActiveParentMenu,
        storeActiveMenu
    } = props;
    let [tag, setTag] = useState(null);
    let [title, setTitle] = useState(meta.title);
    const [errors, setErrors] = useState(null);
    const navigateTo = path => history.push(path);
    const handleSubmitForm = (data, event) => {
        event.preventDefault();
        showLoading();
        const tmpData = {...data};
        Object.keys(tmpData).forEach(key => (tmpData[key] === null || tmpData[key] === undefined) && delete tmpData[key]);
        update(tag.id, tmpData)
            .then(response => {
                Helpers.showToast('success', response.message, 1500);
                history.push('/tags');
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
        const fetchData = async id => {
            const resApiPath = await getApiPath(meta.apiPath);
            const resTag = await edit(id);
            return Promise.all([resApiPath, resTag]);
        };
        fetchData(match.params.id)
            .then(fullFill => {
                const apiPath = fullFill[0].data;
                const tag = fullFill[1].data;
                setTag(tag);
                setTitle(`${meta.title} #${tag.id}`);
                Helpers.changeAppTitle(`${meta.title} #${tag.id}`);
                if (apiPath) {
                    storeActiveMenu(apiPath.api_path);
                    storeActiveParentMenu(apiPath.parent ? apiPath.parent.api_path : null);
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
                title={title}
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
                        <TagForm errors={errors} data={tag} submit={handleSubmitForm}/>
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