import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {
    hideLoading,
    showLoading,
    storeActiveMenu,
    storeActiveParentMenu
} from '../../store/actions/MainActions';
import {getApiPath} from '../../api/sidebar';
import {destroy} from '../../api/permissions';
import Helpers from '../../utils/helpers';
import Auxiliary from "../../components/hoc/Auxiliary";
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import {NavLink} from "react-router-dom";
import TableActionsDropdown from "../../components/TableActionsDropdown";
import {Dropdown} from "react-bootstrap";
import CustomMenu from "../../components/bootstrap/customs/CustomMenu";
import Datatable from "../../components/datatable/Datatable";
import Moment from "react-moment";

function Index(props) {
    const {
        history,
        meta,
        showLoading,
        hideLoading,
        storeActiveMenu,
        storeActiveParentMenu,
        breadcrumbs
    } = props;
    const columns = [
        {
            field: 'id',
            text: 'ID',
            clName: 'text-center',
            orderable: true,
            orderActive: true,
            orderType: 'ASC'
        },
        {
            field: 'name',
            text: 'Tên',
            clName: 'text-center',
            orderable: true,
            orderActive: false
        },
        {
            field: 'note',
            text: 'Ghi chú',
            clName: 'text-center',
            orderable: true,
            orderActive: false
        },
        {
            field: 'created_at',
            text: 'Created at',
            clName: 'text-center',
            orderable: true,
            orderActive: false
        }
    ];
    const urls = {
        allData: 'permissions/all-permissions',
        search: 'permissions/search'
    };
    const language = {
        loading: 'Đang tải...',
        length_menu: 'Hiển thị: _MENU_ dòng mỗi trang',
        search_placeholder: 'Tìm kiếm...',
        footer_info: 'Hiển thị từ _START_ đến _END_ trong tổng _TOTAL_ dòng',
        no_data: 'Không có dữ liệu',
        no_search_result: 'Không tìm thấy dữ liệu',
    };
    const [reload, setReload] = useState(false);
    const navigateTo = path => history.push(path);
    const dropdown = item => {
        return (
            <Dropdown.Menu as={CustomMenu}>
                <Dropdown.Item
                    onClick={navigateTo.bind(this, `/permissions/edit/${item.id}`)}
                    eventKey="1">
                    <span className="mr-3">
                        <i className="ti-pencil mr-2"/> Cập nhật
                </span>
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={handleDelete.bind(this, item)}
                    eventKey="2">
                    <span className="mr-3">
                        <i className="ti-close mr-2"/> Xóa
                </span>
                </Dropdown.Item>
            </Dropdown.Menu>
        )
    };
    const row = item => {
        return (
            <tr key={item.id}>
                <td className="text-center">
                    <TableActionsDropdown actions={dropdown(item)}/>
                </td>
                <td className="text-center">{item.id}</td>
                <td><NavLink to={`/permissions/edit/${item.id}`}><b>{item.name}</b></NavLink></td>
                <td>{item.note ? item.note : 'N/A'}</td>
                <td className="text-center">
                    {item.created_at ? <Moment format="DD/MM/YYYY">{item.created_at}</Moment> : 'N/A'}
                </td>
            </tr>
        )
    };
    const handleDelete = item => {
        const swalSetting = {
            title: 'Xác nhận xóa',
            text: 'Bạn có muốn xóa quyền này ?<br> Người dùng có thể sẽ không thực hiện được một số chức năng của hệ thống',
            confirmBtnText: 'Xóa',
            cancelBtnText: 'Hủy bỏ',
            showCancelButton: true,
            isHtml: true
        };
        Helpers.swalConfirm(swalSetting, () => {
            showLoading();
            destroy(item.id)
                .then(({message}) => {
                    Helpers.showToast('success', message);
                    setReload(!reload);
                    hideLoading();
                })
                .catch(error => {
                    Helpers.feedback(error, hideLoading)
                });
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
            })
            .catch(error => {
                Helpers.feedback(error, hideLoading)
            });
    }, []);
    return (
        <Auxiliary>
            <PageHeading title={meta.title} breadcrumbs={breadcrumbs}/>
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <BoxHead title={meta.title}>
                        <div
                            onClick={navigateTo.bind(this, '/permissions/create')}
                            className="btn btn-gradient-purple btn-rounded btn-fix">
                            <i className={'ti-plus mr-1'}/> Tạo mới
                        </div>
                    </BoxHead>
                    <div className="ibox-body">
                        <Datatable
                            reload={reload}
                            language={language}
                            urls={urls}
                            columns={columns}
                            row={row}
                            action/>
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
export default connect(null, mapDispatchToProps)(Index);