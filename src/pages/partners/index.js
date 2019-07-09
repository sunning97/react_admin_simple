import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
    storeActiveMenu,
    storeActiveParentMenu,
    showLoading,
    hideLoading
} from '../../store/actions/MainActions';
import { getApiPath } from '../../api/sidebar';
import { destroy, updateStatus } from '../../api/partners';
import Helpers from '../../utils/helpers';
import Auxiliary from '../../components/hoc/Auxiliary';
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import Datatable from "../../components/datatable/Datatable";
import { Dropdown } from "react-bootstrap";
import CustomMenu from "../../components/bootstrap/customs/CustomMenu";
import TableActionsDropdown from "../../components/TableActionsDropdown";
import { NavLink } from "react-router-dom";
import Moment from "react-moment";
import classNames from "classnames";

function Index(props) {
    const {
        hideLoading,
        meta,
        history,
        storeActiveMenu,
        storeActiveParentMenu,
        breadcrumbs
    } = props;
    const [reload, setReload] = useState(false);

    /**
     * @type        {Array}
     * @description define datatable columns for partners
     */
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
            field: 'status',
            text: 'Trạng thái',
            clName: 'text-center',
            orderable: true,
            orderActive: false
        },
        {
            field: 'image_path',
            text: 'Ảnh',
            clName: 'text-center',
            orderable: true,
            orderActive: false
        },
        {
            field: 'website',
            text: 'Website',
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

    /**
     * @type        {Array}
     * @description define datatable custome language
     */
    const language = {
        loading: 'Đang tải...',
        length_menu: 'Hiển thị: _MENU_ dòng mỗi trang',
        search_placeholder: 'Tìm kiếm...',
        footer_info: 'Hiển thị từ _START_ đến _END_ trong tổng _TOTAL_ dòng',
        no_data: 'Không có dữ liệu',
        no_search_result: 'Không tìm thấy dữ liệu',
    };

    /**
     * @type        {Array}
     * @description define datatable url for get data
     */
    const urls = {
        allData: 'partners/all-partners',
        search: 'partners/search',
    };

    const navigateTo = path => history.push(path);
    const formatStatus = status => {
        return (
            <span
                className={classNames(
                    'badge',
                    { 'badge-success': status === 'show', 'badge-danger': status === 'hide' })}>
                {status === 'show' ? 'Hiển thị' : 'Không hiển thị'}
            </span>
        );
    };
    const action = item => {
        return (
            <Dropdown.Menu as={CustomMenu}>
                <Dropdown.Item
                    onClick={navigateTo.bind(this, `/partners/edit/${item.id}`)}
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
    const row = item => {
        return (
            <tr key={item.id}>
                <td className="text-center">
                    <TableActionsDropdown actions={action(item)} />
                </td>
                <td className="text-center">{item.id}</td>
                <td>
                    <NavLink to={`/partners/edit/${item.id}`}>
                        <b>{item.name}</b>
                    </NavLink>
                </td>
                <td
                    style={{ cursor: 'pointer' }}
                    onClick={handleChangeStatus.bind(this, item)}
                    className="text-center">
                    {item.status ? formatStatus(item.status) : 'N/A'}
                </td>
                <td className="text-center"><img className="img-thumbnail" style={{ width: '200px' }} src={item.image_path} alt={item.name}/></td>
                <td>{item.website ? <a href={item.website} className="font-bold" target="_blank" rel="noopener noreferrer">{item.website}</a> : 'N/A'}</td>
                <td>{item.description ? item.description : 'N/A'}</td>
                <td>{item.note ? item.note : 'N/A'}</td>
                <td className="text-center">
                    {
                        item.created_at ? <Moment format="DD/MM/YYYY">{item.created_at}</Moment> : 'N/A'
                    }
                </td>
            </tr>
        )
    };
    const handleChangeStatus = item => {
        const text1 = item.status === 'hide' ? 'hiển thị' : 'ẩn';
        const swalSetting = {
            title: 'Xác nhận thay đổi',
            text: `Bạn có muốn <b>${text1}</b>  đối tác này ?<br>`,
            confirmBtnText: 'Thay đổi',
            cancelBtnText: 'Hủy bỏ',
            showCancelButton: true,
            isHtml: true
        };
        Helpers.swalConfirm(swalSetting, () => {
            showLoading();
            updateStatus(item.id)
                .then(({ message }) => {
                    Helpers.showToast('success', message, 1500);
                    setReload(!reload);
                    hideLoading();
                })
                .catch(error => {
                    Helpers.feedback(error, hideLoading);
                });
        });
    }
    const handleDelete = item => {
        const swalSetting = {
            title: 'Xác nhận xóa',
            text: `Bạn có muốn <b>xóa</b>  đối tác này ?`,
            confirmBtnText: 'Xóa',
            cancelBtnText: 'Hủy bỏ',
            showCancelButton: true,
            isHtml: true
        };
        Helpers.swalConfirm(swalSetting, () => {
            showLoading();
            destroy(item.id)
                .then(({ message }) => {
                    Helpers.showToast('success', message, 1500);
                    setReload(!reload);
                    hideLoading();
                })
                .catch(error => {
                    Helpers.feedback(error, hideLoading);
                });
        });
    };
    useEffect(() => {
        getApiPath(meta.apiPath)
            .then(({ data }) => {
                Helpers.changeAppTitle(meta.title);
                if (data) {
                    storeActiveMenu(data.api_path);
                    storeActiveParentMenu(data.parent ? data.parent.api_path : null);
                }
                hideLoading();
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
                    <BoxHead>
                        <div
                            onClick={navigateTo.bind(this, '/partners/sort-partners')}
                            className="btn btn-gradient-aqua btn-rounded btn-fix mr-1">
                            <i className={'fa fa-sort mr-1'} /> Sắp xếp
                        </div>
                        <div
                            onClick={navigateTo.bind(this, '/partners/create')}
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
                            row={row}
                            action />
                    </div>
                </div>
            </div>
        </Auxiliary>
    );
}
const mapDispatchToProps = dispatch => ({
    storeActiveMenu: menu => dispatch(storeActiveMenu(menu)),
    storeActiveParentMenu: menu => dispatch(storeActiveParentMenu(menu)),
    showLoading: () => dispatch(showLoading()),
    hideLoading: () => dispatch(hideLoading())
});
export default connect(null, mapDispatchToProps)(Index);