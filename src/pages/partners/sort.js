import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {getApiPath} from '../../api/sidebar';
import {
    updateSort,
    prepareSort,
    updateStatus
} from '../../api/partners';
import {
    hideLoading,
    showLoading,
    storeActiveMenu,
    storeActiveParentMenu
} from '../../store/actions/MainActions';
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

function Sort(props) {
    const {
        history,
        location,
        breadcrumbs,
        hideLoading,
        storeActiveMenu,
        storeActiveParentMenu,
        meta
    } = props;
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchData = async () => {
        const resApiPath = await getApiPath(meta.apiPath);
        const resSort = await prepareSort();
        return Promise.all([resApiPath, resSort]);
    };
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
                    height: '130px',
                    lineHeight: '115px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'left'}}>
                    <span style={{flex: 1}}>
                        <b>{collapseIcon}{item.name}</b>
                    </span>
                    <div style={{flex: 1}}>
                        <img className="img-thumbnail" style={{height: '100px'}} src={item.image_path} alt={item.name}/>
                    </div>
                    <div style={{display: 'flex', width: '250px', justifyContent: 'flex-end', alignItems: 'center'}}>
                        <div onClick={handleChangeStatus.bind(this, item)}
                            className="btn btn-primary btn-sm mr-1">
                            <i className={classNames('mr-2', {
                                'fa fa-eye': item.status === 'hide',
                                'fa fa-eye-slash': item.status === 'show'})}/>
                            {item.status === 'show' ? 'Ẩn' : 'Hiển thị'}
                        </div>
                        <div onClick={navigateTo.bind(this, `/partners/edit/${item.id}`, true)}
                            className="btn btn-info btn-sm mr-1">
                            <i className="ti-pencil"/> Sửa
                        </div>
                        <div onClick={handleDelete.bind(this, item)}
                            className="btn btn-danger btn-sm mr-1">
                            <i className="ti-close"/> Xóa
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    const onChangeNestable = items => setPartners(items);
    const handleChangeStatus = item => {
        const text1 = item.status === 'hide' ? 'hiển thị' : 'ẩn';
        const swalSetting = {
            title: 'Xác nhận thay đổi',
            text: `Bạn có muốn <b>${text1}</b> đối tác này ?`,
            confirmBtnText: 'Thay đổi',
            cancelBtnText: 'Hủy bỏ',
            showCancelButton: true,
            isHtml: true
        };
        Helpers.swalConfirm(swalSetting, async () => {
            setLoading(true);
            const resChange = await updateStatus(item.id);
            const resPartners = await prepareSort();
            Promise.all([resChange, resPartners])
                .then(fullFill => {
                    const message = fullFill[0].message;
                    const partners = fullFill[1].data;
                    setPartners(partners);
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
    const handleDelete = item => {

    };
    const handleSubmit = event => {
        event.preventDefault();
        setLoading(true);
        updateSort({data: JSON.stringify(partners)})
            .then(({message}) => {
                Helpers.showToast('success', message, 1500);
                setLoading(false);
            })
            .catch(error => {
                Helpers.feedback(error, () => {
                    setLoading(false);
                })
            })
    };
    useEffect(() => {
        fetchData()
            .then(fullFill => {
                const apiPath = fullFill[0].data;
                const dataSort = fullFill[1].data;
                Helpers.changeAppTitle(meta.title);
                setPartners(dataSort);
                if (apiPath) {
                    storeActiveMenu(apiPath.api_path);
                    storeActiveParentMenu(apiPath.parent ? apiPath.parent.api_path : null);
                }
                hideLoading();
            })
            .catch(error => {

            });
    }, []);
    const nestable = (partners.length > 0) ?
        <Auxiliary>
            <InputWrapper className="col-lg-12">
                <Nestable
                    maxDepth={1}
                    renderCollapseIcon={
                        ({isCollapsed}) => isCollapsed ?
                            <i className={'ti-plus mr-2'}/> :
                            <i className={'ti-minus mr-2'}/>
                    }
                    items={partners}
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
                    onClick={handleSubmit}
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
                            onClick={navigateTo.bind(this, '/partners')}
                            className="btn btn-gradient-peach btn-rounded btn-fix mr-1">
                            <i className={'ti-back-left mr-2'}/>
                            Quay lại
                        </div>
                        <div
                            onClick={navigateTo.bind(this, `/partners/create`, true)}
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
    showLoading: () => dispatch(showLoading()),
    hideLoading: () => dispatch(hideLoading()),
    storeActiveMenu: menu => dispatch(storeActiveMenu(menu)),
    storeActiveParentMenu: menu => dispatch(storeActiveParentMenu(menu))
});
export default connect(null, mapDispatchToProps)(Sort);