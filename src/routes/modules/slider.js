import AsyncComponent from '../../components/AsyncComponent';

/**
 * @type string
 * @description define api path for sidebar
 **/
const apiPath = 'sliders';

/**
 * @type        {Array}
 * @description define all route for slider
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
        path: '/sliders',
        component: AsyncComponent(()=>import('../../pages/sliders').then(module=>module.default)),
        exact: true,
        meta: {title: 'Sliders',apiPath},
        child:[
            {
                path: 'create',
                component: AsyncComponent(()=>import('../../pages/sliders/create').then(module=>module.default)),
                exact: true,
                meta: {title: 'Thêm mới slider',apiPath}
            },
            {
                path: 'edit/:id',
                component: AsyncComponent(()=>import('../../pages/sliders/edit').then(module=>module.default)),
                exact: true,
                meta: {title: 'Cập nhật slider',apiPath}
            },
            {
                path: 'sort-sliders',
                component: AsyncComponent(()=>import('../../pages/sliders/sortSlider').then(module=>module.default)),
                exact: true,
                meta: {title: 'Sắp xếp sliders',apiPath}
            }
        ]
    }
]