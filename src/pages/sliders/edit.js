import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {
    storeActiveMenu,
    storeActiveParentMenu,
    hideLoading,
    showLoading
} from '../../store/actions/MainActions';
import {edit, update} from '../../api/sliders';
import {getApiPath} from '../../api/sidebar';
import Helpers from '../../utils/helpers';
import PageHeading from "../../components/PageHeading";
import BoxHead from "../../components/BoxHead";
import Auxiliary from "../../components/hoc/Auxiliary";
import SliderForm from "../../components/form/SliderForm";

function Edit(props) {
    const {breadcrumbs, match, meta, history, location, hideLoading, showLoading, storeActiveMenu, storeActiveParentMenu} = props;
    const [slider, setSlider] = useState(null);
    const [errors, setErrors] = useState(null);

    const navigateTo = path => {
        const redirectPath = location.state && location.state.from ?
            location.state.from :
            path;
        history.push(redirectPath);
    };
    const handleSubmitForm = (data, event) => {
        event.preventDefault();
        showLoading();
        let dataTmp = {...data};
        delete dataTmp.image_path;
        Object.keys(dataTmp).forEach(key => dataTmp[key] === null && delete dataTmp[key]);
        update(slider.id, dataTmp)
            .then(response => {
                Helpers.showToast('success', response.message);
                const redirectPath = (location.state && location.state.from) ? location.state.from : '/sliders';
                history.push(redirectPath);
            })
            .catch(error => {
                const status = error.status;
                if (status === 403) {
                    let errors = Object.keys(error.data.data).reduce((current, next) => {
                        return {...current, [next]: error.data.data[next].join(', ')}
                    }, {});
                    setErrors(errors);
                } else {
                    Helpers.feedback(error)
                }
                hideLoading();
            });
    };
    const fetchData = async (id, apiPath) => {
        const resApiPath = await getApiPath(apiPath);
        const resSlider = await edit(id);
        return Promise.all([resApiPath, resSlider]);
    };
    useEffect(() => {
        fetchData(match.params.id, meta.apiPath)
            .then(fullFill => {
                const apiPath = fullFill[0].data;
                const slider = fullFill[1].data;
                setSlider(slider);
                Helpers.changeAppTitle(`${meta.title} #${slider.id}`);
                if (apiPath) {
                    storeActiveMenu(apiPath.api_path);
                    storeActiveParentMenu(apiPath.parent ? apiPath.parent.api_path : null)
                }
                hideLoading();
                Helpers.scrollToTop();
            })
            .catch(error => {
                Helpers.feedback(error, hideLoading)
            });
    }, []);

    return (
        <Auxiliary>
            <PageHeading
                breadcrumbs={breadcrumbs}
                title={`${meta.title} #${slider && slider.id}`}/>
            <div className="page-content fade-in-up">
                <div className="ibox">
                    <BoxHead title={`${meta.title} #${slider && slider.id}`}>
                        <div
                            onClick={navigateTo.bind(this, '/sliders')}
                            className="btn btn-gradient-peach btn-rounded btn-fix">
                            <i className={'ti-back-left mr-2'}/>
                            Quay lại
                        </div>
                    </BoxHead>
                    <div className="ibox-body">
                        <SliderForm
                            errors={errors}
                            data={slider}
                            submit={handleSubmitForm}/>
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
export default connect(null, mapDispatchToProps)(Edit);