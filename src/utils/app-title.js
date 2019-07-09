import {appTitle} from './default-settings';

const title = appTitle || 'Simple React Admin';

const getPageTitle = pageTitle => pageTitle ? `${pageTitle} | ${title}` : title;

export default getPageTitle;