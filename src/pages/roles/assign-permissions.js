import React, { useEffect,useState } from 'react';
import Helpers from '../../utils/helpers';
import "@kenshooui/react-multi-select/dist/style.css";
import MultiSelect from "@kenshooui/react-multi-select";
import Auxiliary from "../../components/hoc/Auxiliary";
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import {
    hideLoading,
    showLoading,
    storeActiveMenu,
    storeActiveParentMenu
} from '../../store/actions/MainActions';
import {getApiPath} from '../../api/sidebar';
import {preparePermissions, updateRolePermissions} from '../../api/roles';
import {connect} from 'react-redux';
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";

function AssignPermissions(props) {
    const {
        meta,
        showLoading,
        hideLoading,
        history,
        match,
        storeActiveMenu,
        storeActiveParentMenu,
        breadcrumbs
    } = props;
    const [permissions,setPermissions] = useState([]);
    const [selectedPermissions,setSelectedPermissions] = useState([]);
    const [role,setRole] = useState(null);
    const navigateTo = path => history.push(path);
    const handleUpdatePermission = () => {
        showLoading();
        if(selectedPermissions.length === 0){
            Helpers.showToast('success', 'không có thay đổi nào, quay trở lại trang danh mục');
            navigateTo('/roles');
        } else {
            const payload = {permissions: JSON.stringify(selectedPermissions)};
            updateRolePermissions(role.id, payload)
                .then(response => {
                    Helpers.showToast('success', response.message,1500);
                    navigateTo('/roles');
                })
                .catch(error => {
                    Helpers.feedback(error, hideLoading)
                })
        }
    };
    const handleMultiSelect = selectedItems => setSelectedPermissions(selectedItems);
    useEffect(()=>{
        const fetchData = async (id, apiPath) => {
            const responsePath = await getApiPath(apiPath);
            const data = await preparePermissions(id);
            return Promise.all([responsePath, data]);
        };
        fetchData(match.params.id, meta.apiPath)
            .then(fullFill => {
                const apiPath = fullFill[0].data;
                const data = fullFill[1].data;
                const role = data.role;
                const allPermissions = data.allPermissions;
                const currentPermissions = data.currentPermisisons;
                Helpers.changeAppTitle(meta.title);
                if(apiPath){
                    storeActiveMenu(apiPath.api_path);
                    storeActiveParentMenu(apiPath.parent ? apiPath.parent.api_path: null);
                }
                setRole(role);
                setPermissions(allPermissions);
                setSelectedPermissions(currentPermissions);
                hideLoading();
            })
            .catch(error => {
                Helpers.feedback(error, hideLoading)
            })
    },[]);
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
                            className="btn btn-gradient-peach btn-rounded btn-fix mr-2">
                            <i className={'ti-back-left mr-2'}/>
                            Quay lại
                        </div>
                        <div
                            onClick={handleUpdatePermission}
                            className="btn btn-gradient-aqua btn-rounded btn-fix">
                            <i className={'ti-check mr-2'}/>
                            Hoàn thành
                        </div>
                    </BoxHead>
                    <div className="ibox-body">
                        <Row>
                            <Col className="offset-2 col-lg-8">
                                <MultiSelect
                                    items={permissions}
                                    selectedItems={selectedPermissions}
                                    onChange={handleMultiSelect}
                                />
                            </Col>
                        </Row>
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
export default connect(null, mapDispatchToProps)(AssignPermissions);