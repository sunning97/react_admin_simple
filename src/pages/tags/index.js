import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {
    hideLoading,
    showLoading,
    storeActiveMenu,
    storeActiveParentMenu
} from '../../store/actions/MainActions';
import {getApiPath} from '../../api/sidebar';
import {destroy} from '../../api/tags';
import Helpers from '../../utils/helpers';
import {Dropdown} from "react-bootstrap";
import CustomMenu from "../../components/bootstrap/customs/CustomMenu";
import TableActionsDropdown from "../../components/TableActionsDropdown";
import {NavLink} from "react-router-dom";
import Moment from "react-moment";
import Auxiliary from "../../components/hoc/Auxiliary";
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import Datatable from "../../components/datatable/Datatable";

function Index(props) {
    const {history,
        showLoading,
        hideLoading,
        meta,
        storeActiveParentMenu,
        storeActiveMenu,
        breadcrumbs
    } = props;
    const columnsTitle = [
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
    const language = {
        loading: 'Đang tải...',
        length_menu: 'Hiển thị: _MENU_ dòng mỗi trang',
        search_placeholder: 'Tìm kiếm...',
        footer_info: 'Hiển thị từ _START_ đến _END_ trong tổng _TOTAL_ dòng',
        no_data: 'Không có dữ liệu',
        no_search_result: 'Không tìm thấy dữ liệu',
    };
    const urls = {
        allData: 'tags/all-tags',
        search: 'tags/search',
    };
    const [reload, setReload] = useState(false);
    const navigateTo = path => history.push(path);
    const dropdownAction = item => {
        return (
            <Dropdown.Menu as={CustomMenu}>
                <Dropdown.Item
                    onClick={navigateTo.bind(this, `/tags/edit/${item.id}`)}
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
    const singleRow = item => {
        return (
            <tr key={item.id}>
                <td className="text-center">
                    <TableActionsDropdown actions={dropdownAction(item)}/>
                </td>
                <td className="text-center">{item.id}</td>
                <td><NavLink to={`/tags/edit/${item.id}`}><b>{item.title}</b></NavLink></td>
                <td>{item.note ? item.note : 'N/A'}</td>
                <td>{item.description ? item.description : 'N/A'}</td>
                <td className="text-center">
                    {item.created_at ? <Moment format="DD/MM/YYYY">{item.created_at}</Moment> : 'N/A'}
                </td>
            </tr>
        )
    };
    useEffect(() => {
        getApiPath(meta.apiPath)
            .then(({data}) => {
                Helpers.changeAppTitle(meta.title);
                if (data) {
                    storeActiveMenu(data.api_path);
                    storeActiveParentMenu(data.parent ? data.parent.api_path: null);
                }
                hideLoading();
            })
            .catch(error => {
                Helpers.feedback(error, hideLoading)
            });

    }, []);
    const handleDelete = item => {
        const swalSetting = {
            title: 'Xác nhận xóa',
            text: 'Bạn có muốn xóa tag này ?',
            confirmBtnText: 'Xóa',
            cancelBtnText: 'Hủy bỏ',
            showCancelButton: true,
            isHtml: true
        };
        Helpers.swalConfirm(swalSetting, () => {
            showLoading();
            destroy(item.id)
                .then(response => {
                    setReload(!reload);
                    Helpers.showToast('success', response.message);
                    hideLoading();
                })
                .catch(error => {
                    Helpers.feedback(error, hideLoading)
                });
        });
    };
    return (
        <Auxiliary>
            <PageHeading title={meta.title} breadcrumbs={breadcrumbs}/>
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <BoxHead>
                        <div
                            onClick={navigateTo.bind(this, '/tags/create')}
                            className="btn btn-gradient-purple btn-rounded btn-fix">
                            <i className={'ti-plus mr-1'}/> Tạo mới
                        </div>
                    </BoxHead>
                    <div className="ibox-body">
                        <Datatable
                            reload={reload}
                            language={language}
                            urls={urls}
                            columns={columnsTitle}
                            action
                            row={singleRow}/>
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