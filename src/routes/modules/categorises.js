import AsyncComponent from '../../components/AsyncComponent';

/**
 * @type        {String}
 * @description define api path
 */
const apiPath = 'categories';

/**
 * @type        {Array}
 * @description define all route for categories
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
        path: '/categories',
        component: AsyncComponent(()=>import('../../pages/categories').then(module=>module.default)),
        exact: true,
        meta:{title: 'Thể loại',apiPath},
        child:[
            {
                path: 'create',
                component: AsyncComponent(()=>import('../../pages/categories/create').then(module=>module.default)),
                exact: true,
                meta: {title: 'Thêm mới thể loại',apiPath}
            },
            {
                path:'edit/:id',
                component: AsyncComponent(()=>import('../../pages/categories/edit').then(module=>module.default)),
                exact: true,
                meta: {title: 'Cập nhật thể loại',apiPath}
            },
            {
                path: 'sort-categories',
                component: AsyncComponent(()=>import('../../pages/categories/sortCategories').then(module=>module.default)),
                exact: true,
                meta: {title: 'Sắp xếp thể loại',apiPath}
            }
        ]
    },
]