import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Helpers from '../../utils/helpers';
import {
    hideLoading,
    showLoading,
    storeActiveMenu,
    storeActiveParentMenu
} from '../../store/actions/MainActions';
import {getApiPath} from '../../api/sidebar';
import {prepareOrders, updateOrders, updateStatus, destroy} from '../../api/sliders';
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

function SortSlider(props) {
    const {
        meta,
        hideLoading,
        history,
        location,
        breadcrumbs,
        storeActiveMenu,
        storeActiveParentMenu
    } = props;
    const [sliders, setSliders] = useState([]);
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
                    height: '103px',
                    lineHeight: '30px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'center'
                }}>
                    <div style={{flex: 3}}><b>{collapseIcon}{item.title}</b></div>
                    <div style={{flex: 1}}>
                        <img className={'img-thumbnail'} style={{width: '150px'}} src={item.image_path}
                             alt={item.title}/>
                    </div>
                    <div style={{display: 'flex', width: '250px', justifyContent: 'flex-end'}}>
                        <div
                            onClick={handleChangeStatus.bind(this, item)}
                            className="btn btn-primary btn-sm mr-1">
                            <i className={classNames('mr-2', {
                                'fa fa-eye': item.status === 'hide',
                                'fa fa-eye-slash': item.status === 'show'
                            })}/>
                            {item.status === 'show' ? 'Ẩn' : 'Hiện'}
                        </div>
                        <div
                            onClick={navigateTo.bind(this, `/sliders/edit/${item.id}`, true)}
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

    const fetchData = async () => {
        const resApiPath = await getApiPath(meta.apiPath);
        const resAllSliders = await prepareOrders();
        return Promise.all([resApiPath, resAllSliders])
    };

    useEffect(() => {
        fetchData()
            .then(fullFill => {
                Helpers.changeAppTitle(meta.title);
                const apiPath = fullFill[0].data;
                const sliders = fullFill[1].data;
                setSliders(sliders);
                if (apiPath) {
                    storeActiveMenu(apiPath.api_path);
                    storeActiveParentMenu(apiPath.parent ? apiPath.parent.api_path : null);
                }
                hideLoading();
                Helpers.scrollToTop();
            })
            .catch(error => {
                Helpers.feedback(error, hideLoading);
            });
    }, []);

    const onChangeNestable = items => setSliders(items);
    const handleSubmitSort = () => {
        setLoading(true);
        updateOrders({data: JSON.stringify(sliders)})
            .then(response => {
                setLoading(false);
                Helpers.showToast('success', response.message);
            })
            .catch(error => {
                Helpers.feedback(error, () => {
                    setLoading(false);
                })
            })
    };
    const handleChangeStatus = item => {
        const swalSetting = {
            title: 'Xác nhận thay đổi',
            text: `Bạn có muốn <b>${item.status === 'show' ? 'ẩn' : 'hiện'}</b> slide này ?`,
            confirmBtnText: 'Thay đổi',
            cancelBtnText: 'Hủy bỏ',
            showCancelButton: true,
            isHtml: true
        };
        Helpers.swalConfirm(swalSetting, async () => {
            setLoading(true);
            const resUpdate = await updateStatus(item.id);
            const resSliders = await prepareOrders();
            Promise.all([resUpdate, resSliders])
                .then(fullFill => {
                    const message = fullFill[0].message;
                    const sliders = fullFill[1].data;
                    setSliders(sliders);
                    setLoading(false);
                    Helpers.showToast('success', message);
                })
                .catch(error => {
                    Helpers.feedback(error, () => {
                        setLoading(false);
                    })
                });
        });
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
        Helpers.swalConfirm(swalSetting, async () => {
            setLoading(true);
            const resDelete = await destroy(item.id);
            const resSliders = await prepareOrders();
            Promise.all([resDelete, resSliders])
                .then(fullFill => {
                    const message = fullFill[0].message;
                    const sliders = fullFill[1].data;
                    setSliders(sliders);
                    setLoading(false);
                    Helpers.showToast('success', message);
                })
                .catch(error => {
                    Helpers.feedback(error, () => {
                        setLoading(false);
                    })
                })

        });
    };

    const nestable = (sliders.length > 0) ? <Auxiliary>
            <InputWrapper className="col-lg-12">
                <Nestable
                    maxDepth={1}
                    renderCollapseIcon={
                        ({isCollapsed}) => isCollapsed ?
                            <i className={'ti-plus mr-2'}/> :
                            <i className={'ti-minus mr-2'}/>
                    }
                    items={sliders}
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
                            onClick={navigateTo.bind(this, '/sliders')}
                            className="btn btn-gradient-peach btn-rounded btn-fix mr-1">
                            <i className={'ti-back-left mr-2'}/>
                            Quay lại
                        </div>
                        <div
                            onClick={navigateTo.bind(this, `/sliders/create`, true)}
                            className="btn btn-gradient-purple btn-rounded btn-fix">
                            <i className={'ti-plus mr-1'}/> Tạo mới
                        </div>
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
    storeActiveMenu: menu => dispatch(storeActiveMenu(menu)),
    storeActiveParentMenu: menu => dispatch(storeActiveParentMenu((menu))),
    hideLoading: () => dispatch(hideLoading()),
    showLoading: () => dispatch(showLoading())
});
export default connect(null, mapDispatchToProps)(SortSlider);