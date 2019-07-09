import React, {useState, useEffect} from 'react';
import Helpers from '../../utils/helpers';
import {connect} from 'react-redux';
import {
    storeActiveMenu,
    storeActiveParentMenu,
    hideLoading,
    showLoading
} from '../../store/actions/MainActions';
import {getApiPath} from '../../api/sidebar';
import {edit, update} from '../../api/roles';
import Auxiliary from "../../components/hoc/Auxiliary";
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import RoleForm from "../../components/form/RoleForm";

function Edit(props) {
    const {
        history,
        showLoading,
        hideLoading,
        meta,
        match,
        storeActiveMenu,
        storeActiveParentMenu,
        breadcrumbs
    } = props;
    const [role, setRole] = useState(null);
    const [title, setTitle] = useState(meta.title);
    const [errors, setErrors] = useState(null);
    const navigateTo = path => {
        history.push(path);
    };
    const fetchData = async (id, apiPath) => {
        try {
            const responsePath = await getApiPath(apiPath);
            const role = await edit(id);
            return Promise.all([responsePath, role])
        } catch (e) {
            return Promise.reject(e);
        }
    };
    const handleSubmit = (data, event) => {
        event.preventDefault();
        showLoading();
        const tmp = {...data};
        Object.keys(tmp).forEach(key => !tmp[key] && delete tmp[key]);
        update(role.id, tmp).then(
            response => {
                Helpers.showToast('success', response.message);
                history.push('/roles');
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
        fetchData(match.params.id, meta.apiPath)
            .then(fullFill => {
                const apiPath = fullFill[0].data;
                const role = fullFill[1].data;
                setRole(role);
                Helpers.changeAppTitle(`${title} #${role.id}`);
                setTitle(`${title} #${role.id}`);
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
        role && <Auxiliary>
            <PageHeading
                title={title}
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
                        <RoleForm
                            data={role}
                            errors={errors}
                            submit={handleSubmit}/>
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
export default connect(null, mapDispatchToProps)(Edit);