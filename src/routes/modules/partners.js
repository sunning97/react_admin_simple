import AsyncComponent from '../../components/AsyncComponent';

/**
 * @type        {string} 
 * @description define api path for menu
 */
const apiPath = 'partners';

/**
 * @type        {Array}
 * @description define all route for partners
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
        path: '/partners',
        component: AsyncComponent(() => import('../../pages/partners').then(module => module.default)),
        exact: true,
        meta: { title: 'Đối tác', apiPath },
        child: [
            {
                path: 'create',
                component: AsyncComponent(() => import('../../pages/partners/create').then(module => module.default)),
                exact: true,
                meta: { title: 'Tạo mới đối tác', apiPath }
            },
            {
                path: 'edit/:id',
                component: AsyncComponent(() => import('../../pages/partners/edit').then(module => module.default)),
                exact: true,
                meta: { title: 'Cập nhật đối tác', apiPath }
            },
            {
                path: 'sort-partners',
                component: AsyncComponent(() => import('../../pages/partners/sort').then(module => module.default)),
                exact: true,
                meta: { title: 'Sắp xếp đối tác', apiPath }
            }
        ]
    }
]