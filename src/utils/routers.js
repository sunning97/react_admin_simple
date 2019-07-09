import {resolve} from "path";
import EmptyLayout from "../components/layouts/EmptyLayout";
import MainLayout from "../components/layouts/MainLayout";

/**
 * @type        {function}
 * @description parse all route and inject breadcrumb
 * @param       {Array} data
 * @param       {string} parentPath
 * @param       {Array} parentBreadcrumbs
 * @return      {Array}
 */
export function parseRoutesAndInject(data, parentPath = '',parentBreadcrumbs=[]) {
    let result = [];
    data.forEach(item => {
        const path = resolve(parentPath,item.path);
        const {component, exact, meta,layout} = item;
        let breadcrumbsTmp = [...parentBreadcrumbs,{path,title: meta.title ? meta.title : ''}];
        const Layout = layout === 'empty' ? EmptyLayout : MainLayout;
        if (item.child && item.child.length > 0)
            result = [...result,...parseRoutesAndInject(item.child, item.path,breadcrumbsTmp)];
        result.push({path, component, exact, meta,breadcrumbs: breadcrumbsTmp,Layout})
    });
    return result;
}
