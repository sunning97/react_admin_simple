import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {
    hideLoading,
    showLoading,
    storeActiveMenu,
    storeActiveParentMenu
} from '../../store/actions/MainActions';
import {getApiPath} from '../../api/sidebar';
import {
    destroy,
    prepareSortCategories,
    updateSort,
    updateStatus
} from '../../api/categories';
import Helpers from '../../utils/helpers';
import Auxiliary from "../../components/hoc/Auxiliary";
import InputWrapper from "../../components/hoc/InputWrapper";
import Nestable from "react-nestable";
import {Button} from "reactstrap";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import BlockUi from "react-block-ui";
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import classNames from "classnames";

function SortCategories(props) {
    const {
        breadcrumbs,
        location,
        history,
        storeActiveMenu,
        storeActiveParentMenu,
        meta,
        hideLoading
    } = props;
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigateTo = (path, addFrom = false) => {
        if (addFrom) {
            history.push({
                pathname: path,
                state: {
                    from: location.pathname
                }
            });
        } else {
            history.push(path);
        }
    };
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
                    <span style={{flex: 1}}><b>{collapseIcon}{item.title}</b> </span>
                    <div>
                        <div
                            onClick={handleChangeStatus.bind(this, item)}
                            className="btn btn-primary btn-sm mr-1">
                            <i className={classNames('mr-2', {
                                'fa fa-eye': item.status === 'hide',
                                'fa fa-eye-slash': item.status === 'show'
                            })}/>
                            {item.status === 'show' ? 'Ẩn' : 'Hiển thị'}
                        </div>
                        <div
                            onClick={navigateTo.bind(this, `/categories/edit/${item.id}`, true)}
                            className="btn btn-info btn-sm mr-1">
                            <i className="ti-pencil"/> Sửa
                        </div>
                        <div
                            onClick={handleDelete.bind(this, item)}
                            className="btn btn-danger btn-sm mr-1">
                            <i className="ti-close"/> Xóa
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    const onChangeNestable = items => setCategories(items);
    const handleSubmitSort = () => {
        setLoading(true);
        const payload = {data: JSON.stringify(categories)};
        updateSort(payload)
            .then(response => {
                Helpers.showToast('success', response.message, 1500);
                setLoading(false);
            })
            .catch(error => {
                Helpers.feedback(error, () => {
                    setLoading(false);
                })
            })
    };
    const handleDelete = item => {
        const swalSetting = {
            title: 'Xác nhận xóa',
            text: 'Bạn có muốn xóa <b>thể loại</b> này cùng với <b>tất cả các mục con</b> đang có ?',
            confirmBtnText: 'Xóa',
            cancelBtnText: 'Hủy bỏ',
            showCancelButton: true,
            isHtml: true
        };
        Helpers.swalConfirm(swalSetting, async () => {
            setLoading(true);
            const resDelete = await destroy(item.id);
            const resCategories = await prepareSortCategories();
            Promise.all([resDelete, resCategories]).then(fullFill => {
                const message = fullFill[0].message;
                const categories = fullFill[1].data;
                setCategories(categories);
                Helpers.showToast('success', message, 1500);
                setLoading(false);
            }).catch(error => {
                Helpers.feedback(error, () => {
                    setLoading(false);
                })
            });
        });
    };
    const handleChangeStatus = item => {
        const text1 = item.status === 'hide' ? 'hiển thị' : 'ẩn';
        const text2 = (item.status === 'show' && item.children.length > 0) ? '<br>Các mục con trong thể loại này sẽ không được hiển thị' : '';
        const swalSetting = {
            title: 'Xác nhận thay đổi',
            text: `Bạn có muốn <b>${text1}</b>  thể loại này ?${text2}`,
            confirmBtnText: 'Thay đổi',
            cancelBtnText: 'Hủy bỏ',
            showCancelButton: true,
            isHtml: true
        };
        Helpers.swalConfirm(swalSetting, async () => {
            setLoading(true);
            const resChange = await updateStatus(item.id);
            const resCategories = await prepareSortCategories();
            Promise.all([resChange, resCategories])
                .then(fullFill => {
                    const message = fullFill[0].message;
                    const categories = fullFill[1].data;
                    setCategories(categories);
                    Helpers.showToast('success', message, 1500);
                    setLoading(false);
                })
                .catch(error => {
                    Helpers.feedback(error, () => {
                        setLoading(false);
                    })
                });
        });
    };
    const fetchData = async apiPath => {
        const resApiPath = await getApiPath(apiPath);
        const resCategories = await prepareSortCategories();
        return Promise.all([resApiPath, resCategories]);
    };
    useEffect(() => {
        fetchData(meta.apiPath)
            .then(fullFill => {
                const apiPath = fullFill[0].data;
                const categories = fullFill[1].data;
                setCategories(categories);
                Helpers.changeAppTitle(meta.title);
                if (apiPath) {
                    storeActiveMenu(apiPath.api_path);
                    storeActiveParentMenu(apiPath.parent ? apiPath.parent.api_path : null);
                }
                Helpers.scrollToTop();
                hideLoading();
            })
            .catch(Helpers.feedback)
    }, []);
    const nestable = (categories.length > 0) ? <Auxiliary>
            <InputWrapper className="col-lg-12">
                <Nestable
                    maxDepth={4}
                    renderCollapseIcon={
                        ({isCollapsed}) => isCollapsed ?
                            <i className={'ti-plus mr-2'}/> :
                            <i className={'ti-minus mr-2'}/>
                    }
                    items={categories}
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
                    onClick={handleSubmitSort}
                    color="info">
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
                title={meta.title}/>
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <BoxHead title={meta.title}>
                        <div
                            onClick={navigateTo.bind(this, '/categories')}
                            className="btn btn-gradient-peach btn-rounded btn-fix mr-1">
                            <i className={'ti-back-left mr-2'}/>
                            Quay lại
                        </div>
                        <div
                            onClick={navigateTo.bind(this, `/categories/create`, true)}
                            className="btn btn-gradient-purple btn-rounded btn-fix">
                            <i className={'ti-plus mr-1'}/> Tạo mới
                        </div>
                    </BoxHead>
                    <div className="ibox-body">
                        {
                            categories && nestable
                        }
                    </div>
                </div>
            </div>
        </BlockUi>
    );
}

const mapDispatchToProps = dispatch => ({
    storeActiveParentMenu: menu => dispatch(storeActiveParentMenu(menu)),
    storeActiveMenu: menu => dispatch(storeActiveMenu(menu)),
    hideLoading: () => dispatch(hideLoading()),
    showLoading: () => dispatch(showLoading())
});
export default connect(null, mapDispatchToProps)(SortCategories);