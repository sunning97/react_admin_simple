import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import Helpers from '../../utils/helpers';
import CountUp from 'react-countup';
import {
    storeActiveMenu,
    storeActiveParentMenu,
    hideLoading
} from '../../store/actions/MainActions';
import {getApiPath} from '../../api/sidebar';

function Dashboard(props) {
    const {
        meta,
        hideLoading,
        storeActiveMenu,
        storeActiveParentMenu
    } = props;
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
        <div className="page-content fade-in-up">
            <div className="ibox-body">
                <div className="row mb-4">
                    <div className="col-lg-4 col-md-6">
                        <div className="card mb-4">
                            <div className="card-body flexbox-b">
                                <div className={'text-success mr-5'}>
                                    <i className={'font-26 ti-home'}/>
                                </div>
                                <div>
                                    <CountUp
                                        className="font-strong text-success"
                                        style={{fontSize: '32px'}}
                                        delay={0}
                                        duration={3}
                                        start={0}
                                        end={503}/>
                                    <div className="text-muted">NEW CUSTOMERS</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="card mb-4">
                            <div className="card-body flexbox-b">
                                <div className={'text-primary mr-5'}>
                                    <i className={'font-26 ti-world'}/>
                                </div>
                                <div>
                                    <CountUp
                                        className="font-strong text-primary"
                                        style={{fontSize: '32px'}}
                                        delay={0}
                                        duration={3}
                                        start={0}
                                        end={611}/>
                                    <div className="text-muted">TODAY'S VISITS</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="card mb-4">
                            <div className="card-body flexbox-b">
                                <div className={'text-pink mr-5'}>
                                    <i className={'font-26 ti-tag'}/>
                                </div>
                                <div>
                                    <CountUp
                                        className="font-strong text-pink"
                                        style={{fontSize: '32px'}}
                                        delay={0}
                                        duration={3}
                                        start={0}
                                        end={100}/>
                                    <div className="text-muted">SUPPORT TICKETS</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-6">
                        <div className="ibox">
                            <div className="ibox-head">
                                <div className="ibox-title">Basic Table</div>
                            </div>
                            <div className="ibox-body">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Username</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Mark</td>
                                        <td>Otto</td>
                                        <td>@mdo</td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>Jacob</td>
                                        <td>Thornton</td>
                                        <td>@fat</td>
                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>Larry</td>
                                        <td>the Bird</td>
                                        <td>@twitter</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="ibox">
                            <div className="ibox-head">
                                <div className="ibox-title">Bordered Table</div>
                            </div>
                            <div className="ibox-body">
                                <table className="table table-bordered">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Username</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Mark</td>
                                        <td>Otto</td>
                                        <td>@mdo</td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>Jacob</td>
                                        <td>Thornton</td>
                                        <td>@fat</td>
                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>Larry</td>
                                        <td>the Bird</td>
                                        <td>@twitter</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
const mapDispatchToProps = (dispatch) => ({
    storeActiveMenu: menu => dispatch(storeActiveMenu(menu)),
    storeActiveParentMenu: menu => dispatch(storeActiveParentMenu(menu)),
    hideLoading: () => dispatch(hideLoading())
});
export default connect(null, mapDispatchToProps)(Dashboard);