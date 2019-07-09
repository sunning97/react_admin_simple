import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import Helpers from '../../utils/helpers';
import {
    hideLoading,
    showLoading,
    storeActiveMenu,
    storeActiveParentMenu,
    storeAppMenu
} from "../../store/actions/MainActions";
import {getApiPath, getSideBar} from "../../api/sidebar";
import {
    destroyMenu,
    prepareMenus,
    editMenuType,
    updateSort,
    updateStatus
} from '../../api/menus';
import Auxiliary from "../../components/hoc/Auxiliary";
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import {Button} from 'reactstrap';
import Nestable from 'react-nestable';
import InputWrapper from "../../components/hoc/InputWrapper";
import BlockUi from 'react-block-ui';
import Col from "reactstrap/es/Col";
import Row from "reactstrap/es/Row";
import {sidebarID} from '../../utils/default-settings';

function Builder(props) {
    const {
        history,
        meta,
        match,
        breadcrumbs,
        hideLoading,
        storeActiveParentMenu,
        storeAppMenu,
        storeActiveMenu
    } = props;
    const [menus, setMenus] = useState([]);
    const [menuType, setMenuType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState(meta.title);
    const navigateTo = path => history.push(path);
    const isSidebar = () => menuType.id === sidebarID;
    const renderNestableItem = ({item, index, collapseIcon}) => {
        return (
            <div className="dd-item" key={index}>
                <div className="dd-handle" style={{
                    height: '43px',
                    lineHeight: '30px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'left'
                }}>
                    <span style={{flex: 1}}><b>{collapseIcon}{item.name}</b> </span>
                    <div style={{flex: 2}}>
                        {item.api_path}
                    </div>
                    <div>
                        <div
                            onClick={handleChangeStatus.bind(this, item.id)}
                            className="btn btn-primary btn-sm mr-1">
                            <i className={classNames('mr-2', {
                                'fa fa-eye': item.status === 'hidden',
                                'fa fa-eye-slash': item.status === 'show'
                            })}/>
                            {item.status === 'show' ? 'Ẩn' : 'Hiện'}
                        </div>
                        <div
                            onClick={() => navigateTo(`/menu-builder/${menuType && menuType.id}/edit-menu/${item.id}`)}
                            className="btn btn-info btn-sm mr-1">
                            <i className="ti-pencil"/> Sửa
                        </div>
                        <div
                            onClick={handleDelete.bind(this, item.id)}
                            className="btn btn-danger btn-sm mr-1">
                            <i className="ti-close"/> Xóa
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    const fetchData = async id => {
        try {
            const resPath = await getApiPath(meta.apiPath);
            const resMenuType = await editMenuType(id);
            const resMenu = await prepareMenus(id);
            return Promise.all([resPath, resMenuType, resMenu])
        } catch (e) {
            return Promise.reject(e);
        }
    };
    const onChangeNestable = items => setMenus(items);
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const responseUpdate = await updateSort({data: JSON.stringify(menus)});
            const responsePath = await isSidebar() ? getApiPath(meta.apiPath) : null;
            const responseMenu = await isSidebar() ? getSideBar() : null;
            Promise.all([responseUpdate, responsePath, responseMenu])
                .then(fullFill => {
                    const {message} = fullFill[0];
                    Helpers.showToast('success', message, 1500);
                    if (isSidebar()) {
                        const apiPath = fullFill[1].data;
                        const menus = fullFill[2].data;
                        storeAppMenu(menus);
                        if (apiPath) {
                            storeActiveMenu(apiPath.api_path);
                            storeActiveParentMenu(apiPath.parent ? apiPath.parent.api_path : null);
                        }
                    }
                    setLoading(false);
                });
        } catch (e) {
            Helpers.feedback(e, (() => {
                setLoading(false);
            }))
        }
    };
    const handleDelete = (id, event) => {
        event.preventDefault();
        const swalSetting = {
            title: 'Xác nhận xóa',
            text: 'Bạn có muốn xóa menu này ?<br> Sau khi xóa menu sẽ không còn hiển thị ở sidebar nữa',
            confirmBtnText: 'Xóa',
            cancelBtnText: 'Hủy bỏ',
            showCancelButton: true,
            isHtml: true
        };
        Helpers.swalConfirm(swalSetting, async () => {
            setLoading(true);
            try {
                const responseDelete = await destroyMenu(id);
                const responsePath = await isSidebar() ? getApiPath(meta.apiPath) : null;
                const responseMenu = await isSidebar() ? getSideBar() : null;
                Promise.all([responseDelete, responsePath, responseMenu]).then(
                    fullFill => {
                        const {message} = fullFill[0];
                        Helpers.showToast('success', message, 1500);
                        if (isSidebar()) {
                            const apiPath = fullFill[1].data;
                            const menus = fullFill[2].data;
                            storeAppMenu(menus);
                            if (apiPath) {
                                storeActiveMenu(apiPath.api_path);
                                storeActiveParentMenu(apiPath.parent ? apiPath.parent.api_path : null);
                            }
                            setMenus(menus);
                            setLoading(false);
                        } else setLoading(false);
                    })
            } catch (e) {
                Helpers.feedback(e, () => {
                    setLoading(false);
                })
            }
        });
    };
    const handleChangeStatus = (id, event) => {
        event.preventDefault();
        const dataSwal = {
            title: 'Xác nhận thay đổi',
            text: 'Bạn có muốn thay đổi trạng thái của menu này?',
            confirmBtnText: 'Xác nhận',
            cancelBtnText: 'Hủy bỏ',
            showCancelButton: true,
        };
        Helpers.swalConfirm(dataSwal, async () => {
            setLoading(true);
            try {
                const responseChange = await updateStatus(id);
                const responsePath = await isSidebar() ? getApiPath(meta.apiPath) : null;
                const responseMenu = await isSidebar() ? getSideBar() : null;
                Promise.all([responseChange, responsePath, responseMenu])
                    .then(fullFill => {
                        const message = fullFill[0].message;
                        Helpers.showToast('success', message, 1500);
                        if (isSidebar()) {
                            const apiPath = fullFill[1].data;
                            const menus = fullFill[2].data;
                            storeAppMenu(menus);
                            if (apiPath) {
                                storeActiveMenu(apiPath.api_path);
                                storeActiveParentMenu(apiPath.parent ? apiPath.parent.api_path : null);
                            }
                            setMenus(menus);
                            setLoading(false);
                        } else
                            setLoading(false);
                    });
            } catch (e) {
                Helpers.feedback(e, () => {
                    setLoading(false);
                })
            }
        })
    };
    useEffect(() => {
        fetchData(match.params.id).then(
            fullFill => {
                const apiPath = fullFill[0].data;
                const menuType = fullFill[1].data;
                const menus = fullFill[2].data;
                setTitle(`${meta.title}: ${menuType.name}`);
                Helpers.changeAppTitle(`${meta.title}: ${menuType.name}`);
                if (apiPath) {
                    storeActiveMenu(apiPath.api_path);
                    storeActiveParentMenu(apiPath.parent ? apiPath.parent.api_path : null);
                }
                setMenus(menus);
                setMenuType(menuType);
                window.scroll(0, 0);
                hideLoading();
            },
            error => {
                Helpers.feedback(error, hideLoading)
            })
    }, []);
    const nestable = menus.length > 0 ? <Auxiliary>
            <InputWrapper className="col-lg-12">
                <Nestable
                    maxDepth={2}
                    renderCollapseIcon={
                        ({isCollapsed}) => isCollapsed ?
                            <i className={'ti-plus mr-2'}/> :
                            <i className={'ti-minus mr-2'}/>
                    }
                    items={menus}
                    renderItem={renderNestableItem}
                    onChange={onChangeNestable}/>
            </InputWrapper>
            <InputWrapper className="col-lg-12 text-right">
                <Button
                    type="submit"
                    color="default"
                    className={'mr-1'}>
                    <i className={'ti-reload mr-2'}/>Reset
                </Button>
                <Button
                    color="info"
                    onClick={handleSubmit}>
                    <i className={'ti-check mr-2'}/>Cập nhật
                </Button>
            </InputWrapper>
        </Auxiliary> :
        <Row>
            <Col className="col-lg-12 text-center font-weight-bold">
                Không có dữ liệu!
            </Col>
        </Row>;
    return (
        <BlockUi tag="div" blocking={loading} message={'loading....'}>
            <PageHeading
                breadcrumbs={breadcrumbs}
                title={title}/>
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <BoxHead>
                        {
                            menuType && <Auxiliary>
                                <div
                                    onClick={navigateTo.bind(this, `/menu-builder`)}
                                    className="btn btn-gradient-peach btn-rounded btn-fix mr-1">
                                    <i className={'ti-back-left mr-2'}/>
                                    Quay lại
                                </div>
                                <div
                                    onClick={navigateTo.bind(this, `/menu-builder/${menuType.id}/create-menu`)}
                                    className="btn btn-gradient-purple btn-rounded btn-fix">
                                    <i className={'ti-plus mr-1'}/> Tạo mới
                                </div>
                            </Auxiliary>
                        }

                    </BoxHead>
                    <div className="ibox-body">
                        {nestable}
                    </div>
                </div>
            </div>
        </BlockUi>
    );
}

const mapDispatchToProps = dispatch => ({
    storeActiveParentMenu: menu => dispatch(storeActiveParentMenu(menu)),
    storeActiveMenu: page => dispatch(storeActiveMenu(page)),
    storeAppMenu: data => dispatch(storeAppMenu(data)),
    hideLoading: () => dispatch(hideLoading()),
    showLoading: () => dispatch(showLoading())
});
export default connect(null, mapDispatchToProps)(Builder);