import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
    hideLoading,
    showLoading,
    storeActiveMenu,
    storeActiveParentMenu
} from '../../store/actions/MainActions';
import { getApiPath } from '../../api/sidebar';
import { destroy } from '../../api/sliders';
import Helpers from '../../utils/helpers';
import { Dropdown } from "react-bootstrap";
import CustomMenu from "../../components/bootstrap/customs/CustomMenu";
import TableActionsDropdown from "../../components/TableActionsDropdown";
import { NavLink } from "react-router-dom";
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import Auxiliary from "../../components/hoc/Auxiliary";
import Datatable from "../../components/datatable/Datatable";
import Moment from "react-moment";

function Index(props) {
    const {
        showLoading,
        hideLoading,
        history,
        meta,
        breadcrumbs,
        storeActiveMenu,
        storeActiveParentMenu
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
            field: 'title',
            text: 'Tiêu đề',
            clName: 'text-center',
            orderable: true,
            orderActive: false
        },
        {
            field: 'image_path',
            text: 'Ảnh',
            clName: 'text-center',
            orderable: false,
            orderActive: false
        },
        {
            field: 'status',
            text: 'Trạng thái',
            clName: 'text-center',
            orderable: true,
            orderActive: false
        },
        {
            field: 'description',
            text: 'Mô tả',
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
        allData: 'sliders/all-sliders',
        search: 'sliders/search',
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
    const formatStatus = status => <span
        className={classNames(
            'badge',
            { 'badge-success': status === 'show', 'badge-danger': status === 'hide' }
        )}>{status === 'show' ? 'Hiển thị' : 'Không hiển thị'}</span>;
    const dropdownAction = item => {
        return (
            <Dropdown.Menu as={CustomMenu}>
                <Dropdown.Item
                    onClick={navigateTo.bind(this, `/sliders/edit/${item.id}`)}
                    eventKey="1">
                    <span className="mr-3">
                        <i className="ti-pencil mr-2" /> Cập nhật
                </span>
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={handleDelete.bind(this, item)}
                    eventKey="2">
                    <span className="mr-3">
                        <i className="ti-close mr-2" /> Xóa
                </span>
                </Dropdown.Item>
            </Dropdown.Menu>
        )
    };
    const singleRow = item => {
        return (
            <tr key={item.id}>
                <td className="text-center">
                    <TableActionsDropdown actions={dropdownAction(item)} />
                </td>
                <td className="text-center">{item.id}</td>
                <td><NavLink to={`/sliders/edit/${item.id}`}><b>{item.title}</b></NavLink></td>
                <td><img style={{ width: '200px' }} className={'img-thumbnail'} src={item.image_path} alt={item.title} />
                </td>
                <td className="text-center">{item.status ? formatStatus(item.status) : 'N/A'}</td>
                <td>{item.note ? item.note : 'N/A'}</td>
                <td>{item.description ? item.description : 'N/A'}</td>
                <td className="text-center">
                    {item.created_at ? <Moment format="DD/MM/YYYY">{item.created_at}</Moment> : 'N/A'}
                </td>
            </tr>
        )
    };
    const handleDelete = item => {
        const swalSetting = {
            title: 'Xác nhận xóa',
            text: 'Bạn có muốn xóa slide này ?',
            confirmBtnText: 'Xóa',
            cancelBtnText: 'Hủy bỏ',
            showCancelButton: true,
            isHtml: true
        };
        Helpers.swalConfirm(swalSetting, () => {
            showLoading();
            destroy(item.id)
                .then(response => {
                    Helpers.showToast('success', response.message);
                    hideLoading();
                    setReload(!reload);
                })
                .catch(error => {
                    Helpers.feedback(error, hideLoading)
                });
        });
    };
    useEffect(() => {
        getApiPath(meta.apiPath)
            .then(({ data }) => {
                console.log(data);
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
            })
    }, []);
    return (
        <Auxiliary>
            <PageHeading breadcrumbs={breadcrumbs} title={meta.title} />
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <BoxHead title={meta.title}>
                        <div
                            onClick={navigateTo.bind(this, '/sliders/sort-sliders')}
                            className="btn btn-gradient-aqua btn-rounded btn-fix mr-1">
                            <i className={'fa fa-sort mr-1'} /> Sắp xếp
                        </div>
                        <div
                            onClick={navigateTo.bind(this, '/sliders/create')}
                            className="btn btn-gradient-purple btn-rounded btn-fix">
                            <i className={'ti-plus mr-1'} /> Tạo mới
                        </div>
                    </BoxHead>
                    <div className="ibox-body">
                        <Datatable
                            reload={reload}
                            language={language}
                            urls={urls}
                            columns={columns}
                            action
                            row={singleRow} />
                    </div>
                </div>
            </div>
        </Auxiliary>
    )
}
const mapDispatchToProps = dispatch => ({
    storeActiveMenu: menu => dispatch(storeActiveMenu(menu)),
    storeActiveParentMenu: menu => dispatch(storeActiveParentMenu(menu)),
    hideLoading: () => dispatch(hideLoading()),
    showLoading: () => dispatch(showLoading())
});
export default connect(null, mapDispatchToProps)(Index);