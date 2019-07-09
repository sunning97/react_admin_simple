import {parseRoutesAndInject} from '../utils/routers';
//import all routes in module folder
const modules = require.context('./modules', false, /\.js$/);
//get all routes
const tmp = modules.keys().reduce((current, next) => {
    return [...current, ...modules(next).default];
}, []);
const AppRoutes = parseRoutesAndInject(tmp);
export default AppRoutes;
