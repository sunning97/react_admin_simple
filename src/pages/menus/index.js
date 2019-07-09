import React, {useState, useEffect} from 'react';
import {connect} from "react-redux";
import Moment from 'react-moment';
import Helpers from '../../utils/helpers';
import {
    hideLoading,
    showLoading,
    storeActiveMenu,
    storeActiveParentMenu
} from "../../store/actions/MainActions";
import {getApiPath} from '../../api/sidebar';
import {destroyMenuType} from '../../api/menus';
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import {NavLink} from "react-router-dom";
import Datatable from "../../components/datatable/Datatable";
import Auxiliary from "../../components/hoc/Auxiliary";
import {Dropdown} from "react-bootstrap";
import CustomMenu from "../../components/bootstrap/customs/CustomMenu";
import TableActionsDropdown from "../../components/TableActionsDropdown";

function Index(props) {
    const {
        history,
        showLoading,
        hideLoading,
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
        allData: 'menus/all-menu-types',
        search: 'menus/search-menu-types'
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
                    onClick={navigateTo.bind(this, `/menu-builder/edit-menu-type/${item.id}`)}
                    eventKey="1">
                <span className="mr-3">
                    <i className="ti-pencil mr-2"/> Cập nhật
                </span>
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={navigateTo.bind(this, `/menu-builder/builder/${item.id}`)}
                    eventKey="1">
                <span className="mr-3">
                    <i className="ti-layout-accordion-list mr-2"/> Builder
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
                <td><NavLink to={`/menu-builder/builder/${item.id}`}><b>{item.name}</b></NavLink></td>
                <td>{item.note ? item.note : 'N/A'}</td>
                <td className="text-center">
                    {item.created_at ? <Moment format="DD/MM/YYYY">{item.created_at}</Moment> : 'N/A'}
                </td>
            </tr>
        )
    };
    const handleDelete = (item, event) => {
        event.preventDefault();
        const swalSetting = {
            title: 'Xác nhận xóa',
            text: 'Bạn có muốn xóa loại menu này ?<br> Tất cả những menu con cũng sẽ bị xóa',
            confirmBtnText: 'Xóa',
            cancelBtnText: 'Hủy bỏ',
            showCancelButton: true,
            isHtml: true
        };
        Helpers.swalConfirm(swalSetting, () => {
            showLoading();
            destroyMenuType(item.id)
                .then(response => {
                    Helpers.showToast('success', response.message);
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
            <PageHeading breadcrumbs={breadcrumbs} title={meta.title}/>
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <BoxHead>
                        <div
                            onClick={navigateTo.bind(this, '/menu-builder/create-menu-type')}
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
                            action
                            row={row}/>
                    </div>
                </div>
            </div>
        </Auxiliary>
    );
}

const mapDispatchToProps = dispatch => ({
    storeActiveParentMenu: menu => dispatch(storeActiveParentMenu(menu)),
    storeActiveMenu: page => dispatch(storeActiveMenu(page)),
    hideLoading: () => dispatch(hideLoading()),
    showLoading: () => dispatch(showLoading())
});
export default connect(null, mapDispatchToProps)(Index);