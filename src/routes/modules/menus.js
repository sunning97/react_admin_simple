import AsyncComponent from '../../components/AsyncComponent';

/**
 * @type        {String}
 * @description define api path
 * */
const apiPath = 'menus';

/**
 * @type        {Array}
 * @description define all route for menu
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
        path: '/menu-builder',
        component: AsyncComponent(()=> import('../../pages/menus').then(module=>module.default)),
        exact: true,
        meta: {title: 'Loại menu',apiPath},
        child:[
            {
                path: 'builder/:id',
                component: AsyncComponent(()=>import('../../pages/menus/builder').then(module=>module.default)),
                exact: true,
                meta: {title: 'Menu Builder',apiPath}

            },
            {
                path: ':id/create-menu',
                component: AsyncComponent(()=>import('../../pages/menus/createMenu').then(module=>module.default)),
                exact: true,
                meta: {title: 'Tạo mới menu',apiPath}

            },
            {
                path: ':menu_type_id/edit-menu/:menu_id',
                component: AsyncComponent(()=>import('../../pages/menus/editMenu').then(module=>module.default)),
                exact: true,
                meta: {title: 'Cập nhật menu',apiPath}

            },
            {
                path: 'create-menu-type',
                component: AsyncComponent(()=>import('../../pages/menus/createMenuType').then(module=>module.default)),
                exact: true,
                meta: {title: 'Tạo mới loại menu',apiPath}

            },
            {
                path: 'edit-menu-type/:menu_type_id',
                component: AsyncComponent(()=>import('../../pages/menus/editMenuType').then(module=> module.default)),
                exact: true,
                meta: {title: 'Cập nhật loại menu',apiPath}

            }
        ]
    }
]