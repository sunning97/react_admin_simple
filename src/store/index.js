import { createStore,combineReducers,compose,applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
// import all reducer and combine to one object
const modules = require.context('./reducers',false,/\.js$/);
const reducers = modules.keys().reduce((current, next)=>{
    const key = next.match(/\.\/(.*)Reducer\.js$/)[1].toLowerCase();
    return {...current, [key]: modules(next).default}
},{});
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const Reducer = combineReducers(reducers);
const store = createStore(Reducer,composeEnhancers(applyMiddleware(thunk)));
export default store;