import AsyncComponent from '../../components/AsyncComponent';
/**
 * @type string
 * @description define api path for sidebar
 **/
const apiPath = 'roles';

/**
 * @type        {Array}
 * @description define all route for role
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
        path: '/roles',
        component: AsyncComponent(()=>import('../../pages/roles').then(module=>module.default)),
        exact: true,
        meta: {title:'Vai trò',apiPath},
        child:[
            {
                path: 'create',
                component: AsyncComponent(()=>import('../../pages/roles/create').then(module=>module.default)),
                exact: true,
                meta: {title:'Tạo mới vai trò',apiPath}
            },
            {
                path: 'edit/:id',
                component: AsyncComponent(()=>import('../../pages/roles/edit').then(module=>module.default)),
                exact: true,
                meta: {title:'Cập nhật vai trò',apiPath}
            },
            {
                path: 'assign-permission/:id',
                component: AsyncComponent(()=>import('../../pages/roles/assign-permissions').then(module=>module.default)),
                exact: true,
                meta: {title:'Phân quyền cho vai trò',apiPath}
            }
        ]
    }
];
