import React from 'react';
import {Switch, withRouter} from 'react-router-dom';
import AppRoute from './routes';
import LayoutRoute from './components/layouts/LayoutRoute';
import EmptyLayout from './components/layouts/EmptyLayout';
import Store from "./store";
import Error from './pages/errors/Error';
import {Provider} from "react-redux";
import Loading from "./components/layouts/Loading";

require('./assets/vendors/bootstrap/dist/css/bootstrap.min.css');
require('font-awesome/css/font-awesome.min.css');
require('@sn8/themify-icons/css/themify-icons.css');
require('line-awesome/css/line-awesome.min.css');
require('animate.css/animate.min.css');
require('./assets/css/main.min.css');

function App(props) {
    const generateAppRoute = () =>
        AppRoute.map(
            ({component: C, Layout: L, meta, breadcrumbs, ...rest}, index) => {
                return <LayoutRoute
                    meta={meta}
                    breadcrumbs={breadcrumbs}
                    {...rest}
                    {...props}
                    layout={L}
                    component={C}
                    key={index}
                />
            });
    return (
        <Provider store={Store}>
            <Loading/>
            <Switch>
                {generateAppRoute()}
                <LayoutRoute
                    {...props}
                    layout={EmptyLayout}
                    component={Error}/>
            </Switch>
        </Provider>
    )
}
export default withRouter(App);
