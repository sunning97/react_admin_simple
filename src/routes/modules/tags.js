import AsyncComponent from '../../components/AsyncComponent';

/**
 * @type string
 * @description define path api for show in sidebar
 **/
const apiPath = 'tags';

/**
 * @type        {Array}
 * @description define all route for tag
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
        path: '/tags',
        component: AsyncComponent(()=>import('../../pages/tags').then(module=>module.default)),
        exact: true,
        meta: {title: 'Tags',apiPath},
        child:[
            {
                path: 'create',
                component: AsyncComponent(()=>import('../../pages/tags/create').then(module=>module.default)),
                exact: true,
                meta: {title: 'Thêm mới Tag',apiPath}
            },
            {
                path: 'edit/:id',
                component: AsyncComponent(()=>import('../../pages/tags/edit').then(module=>module.default)),
                exact: true,
                meta: {title: 'Cập nhật Tag',apiPath}
            }
        ]
    }
]