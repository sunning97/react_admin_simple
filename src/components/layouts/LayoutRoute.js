import React from 'react';
import { Route } from 'react-router-dom';

export default  ({component:Component,layout:Layout,meta,breadcrumbs,...rest})=>(
    <Route
        {...rest}
        render={props=>(
            <Layout {...props}>
                <Component {...props} meta={meta} breadcrumbs={breadcrumbs}/>
            </Layout>
        )}/>
);