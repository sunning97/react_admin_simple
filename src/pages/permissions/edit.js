import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Helpers from '../../utils/helpers';
import {hideLoading, showLoading, storeActiveMenu, storeActiveParentMenu} from '../../store/actions/MainActions';
import {getApiPath} from '../../api/sidebar';
import {edit, update} from '../../api/permissions';
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import PermissionForm from "../../components/form/PermissionForm";
import Auxiliary from "../../components/hoc/Auxiliary";

function Edit(props) {
    const {match, meta, history, hideLoading, showLoading, breadcrumbs, storeActiveMenu, storeActiveParentMenu} = props;
    const [permission, setPermission] = useState(null);
    const [title, setTitle] = useState(meta.title);
    const [errors, setErrors] = useState(null);
    const navigationTo = path => {
        history.push(path);
    };
    const handleSubmit = (data, event) => {
        event.preventDefault();
        showLoading();
        const tmp = {...data};
        Object.keys(tmp).forEach(key => !tmp[key] && delete tmp[key]);
        update(permission.id, tmp)
            .then(response => {
                Helpers.showToast('success', response.message);
                history.push('/permissions');
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
    const fetchData = async () => {
        const responsePath = await getApiPath(meta.apiPath);
        const permission = await edit(match.params.id);
        return Promise.all([responsePath, permission])
    };
    useEffect(() => {
        fetchData()
            .then(fullFill => {
                const apiPath = fullFill[0].data;
                const permission = fullFill[1].data;
                setPermission(permission);
                setTitle(`${meta.title} #${permission && permission.id}`);
                Helpers.changeAppTitle(`${meta.title} #${permission && permission.id}`);
                if (apiPath) {
                    storeActiveMenu(apiPath.api_path);
                    storeActiveParentMenu(apiPath.parent ? apiPath.parent.api_path : null)
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
                    <BoxHead title={title}>
                        <div
                            onClick={navigationTo.bind(this, '/permissions')}
                            className="btn btn-gradient-peach btn-rounded btn-fix">
                            <i className={'ti-back-left mr-2'}/>
                            Quay lại
                        </div>
                    </BoxHead>
                    <div className="ibox-body">
                        <PermissionForm errors={errors} data={permission} submit={handleSubmit}/>
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