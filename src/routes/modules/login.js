import AsyncComponent from '../../components/AsyncComponent';

/**
 * @type        {Array}
 * @description define all route for auth
 * Route properties
 *
 * meta: {
 *     title: '',           ==> The title for document title and for breadcrumb **must set**
 * },
 * path: '',                ==> Define path for route **must set**
 * component: Component,    ==> Define what you want to show
 * exact: true/false,       ==> Is that the route is match exact route in browser and then show this route
 * child:[]                 ==> Define Children route and will be merge with parent to complete route
 */
export default [
    {
        layout: 'empty',
        path: '/login',
        component: AsyncComponent(() => import('../../pages/auth/login/index').then(module => module.default)),
        exact: true,
        meta: {title: 'Đăng nhập trang quản trị'},
        child:[]
    }
];