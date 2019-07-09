import React from 'react';
import {connect} from 'react-redux';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import Header from "./Header/index";
import Sidebar from './Sidebar';
import Footer from "./Footer";
import SearchBar from './SearchBar'
import Helpers from '../../utils/helpers';
import {hideLoading, showLoading, storeAppMenu} from '../../store/actions/MainActions';
import {setExpireAt, setToken, storeAuthInfo, storeToken} from '../../store/actions/AuthActions';
import {getExpireAt, getToken} from '../../utils/auth';
import {getSideBar} from '../../api/sidebar';
import {me, refresh} from '../../api/auth';

class MainLayout extends React.Component {
    constructor(props) {
        super(props);
        let isAuth = false;
        let isNeedToRefreshToken = false;
        let isExpire = false;

        const currentTime = parseInt(Helpers.getCurrentTime(Helpers.SECONDS, 7));
        const expiresAt = parseInt(getExpireAt() ? getExpireAt() : 0);

        if (props.token && props.info) isAuth = true;
        if (expiresAt < currentTime) isExpire = true;
        if (!isExpire && (expiresAt - currentTime < 200)) isNeedToRefreshToken = true;
        this.state = {
            isExpire,
            isAuth,
            isNeedToRefreshToken,
            fallBackPath: '/login'
        };
    }

    fallBackToLogin = () => {
        this.props.history.push({
            pathname: this.state.fallBackPath,
            state: {
                from: this.props.location.pathname
            }
        });
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.isAuth !== nextState.isAuth ||
            nextProps.isLoading !== this.props.isLoading
    }

    attempt = async ({isNoMenuData, isAuth, isNeedToRefreshToken}) => {
        const authenticate = await !isAuth &&  me();
        const sideBar = await isNoMenuData && getSideBar();
        const ref = await isNeedToRefreshToken && refresh();
        return Promise.all([authenticate, sideBar, ref])
    };

    componentWillMount() {
        const {
            info,
            menuData,
            storeToken,
            storeAuthInfo,
            storeAppMenu,
            showLoading,
            token
        } = this.props;
        const {
            isExpire,
            isAuth,
            isNeedToRefreshToken
        } = this.state;

        Helpers.hideLoading();
        showLoading();
        const isNoMenuData = menuData.length === 0;
        if (isExpire)
            this.fallBackToLogin();
        else {
            if (!isAuth || isNoMenuData || isNeedToRefreshToken) {
                this.attempt({isNoMenuData, isAuth, isNeedToRefreshToken})
                    .then(fullFill => {
                        if (isNeedToRefreshToken) {
                            const {
                                access_token,
                                expires_at
                            } = fullFill[2];
                            setToken(access_token);
                            setExpireAt(expires_at);
                        }

                        if (!info) storeAuthInfo(fullFill[0].data);
                        if (!token && isNeedToRefreshToken)
                            storeToken(fullFill[2].access_token);
                        else if(!token && !isNeedToRefreshToken)
                            storeToken(getToken());

                        if (isNoMenuData) storeAppMenu(fullFill[1].data);
                        this.setState({
                            isAuth: true,
                            isNeedToRefreshToken: false
                        });

                    })
                    .catch(() => {
                        this.fallBackToLogin();
                    })

            }
        }
    }

    render() {
        const {isAuth, isExpire} = this.state;
        const {isLoading,menuData} = this.props;
        return (
            (isAuth && !isExpire && menuData.length > 0) &&
            <BlockUi tag="div" blocking={isLoading}>
                <div className="page-wrapper">
                    <Header {...this.props} />
                    <Sidebar {...this.props} />
                    <div className="content-wrapper">
                        {this.props.children}
                        <Footer/>
                    </div>
                    <SearchBar/>
                    <div className="backdrop"/>
                </div>
            </BlockUi>
        )
    }
}

const mapStateToProps = state => {
    const {token, info} = state.auth;
    const {menuData, isLoading} = state.main;
    return {token, info, menuData, isLoading}
};
const mapDispatchToProps = dispatch => ({
    storeToken: token => dispatch(storeToken(token)),
    storeAuthInfo: info => dispatch(storeAuthInfo(info)),
    storeAppMenu: data => dispatch(storeAppMenu(data)),
    hideLoading: () => dispatch(hideLoading()),
    showLoading: () => dispatch(showLoading())
});
export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);