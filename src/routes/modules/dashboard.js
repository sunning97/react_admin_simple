import AsyncComponent from '../../components/AsyncComponent'

/**
 * @type        {String}
 * @description define api path for sidebar
 */
const apiPath = 'dashboard';

/**
 * @type        {Array}
 * @description define all route for dashboard
 * Route properties
 *
 * meta: {
 *     title: '',           ==> The title for document title and for breadcrumb **must set**
 *     apiPath: ''          ==> The api path for get data from api and high light the sidebar **must set**
 * },
 * path: '',                ==> Define path for route **must set**
 * component: Component,    ==> Define what you want to show
 * exact: true/false,       ==> Is that the route is match exact route in browser and then show this route
 * child:[]                 ==> Define Children route and will be merge with parent to complete route
 */
export default [
    {
        path: '/',
        component: AsyncComponent(()=>import('../../pages/dashboard').then(module=>module.default)),
        exact: true,
        meta: {title:'Bảng điều khiển',apiPath}
    }
];