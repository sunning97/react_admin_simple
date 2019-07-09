import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Helpers from '../../../utils/helpers';
import {setToken, setExpireAt, getExpireAt} from '../../../utils/auth';
import {storeToken} from '../../../store/actions/AuthActions';
import '../../../assets/css/login.css';
import LoginForm from "../../../components/auth/LoginForm";
import {login} from '../../../api/auth';

function Index(props) {
    const {location, history, meta} = props;
    const [email, setEmail] = useState('mrcatbro97@gmail.com');
    const [password, setPassword] = useState('password');
    const [currentPath] = useState('/login');
    const [errors, setErrors] = useState({
        email: null,
        password: null,
        overall: null
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        Helpers.changeAppTitle(meta.title);
        document.body.classList.add('body-login');
        const currentTime = parseInt(Helpers.getCurrentTime(Helpers.SECONDS, 7));
        const expiresAt = parseInt(getExpireAt() ? getExpireAt() : 0);
        if (currentTime < expiresAt) {
            history.push('/');
        }
    }, []);

    const onChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        setErrors({...errors, [name]: null});
        if (name === 'email') setEmail(value); else setPassword(value);
    };

    const handleLoginSuccess = ({access_token, expires_at}) => {
        const redirectPath = location.state && location.state.from ? location.state.from : '/';
        storeToken(access_token);
        setToken(access_token);
        setExpireAt(expires_at);
        history.push({
            pathname: redirectPath,
            state: {
                from: currentPath
            }
        });
    };
    const handleLoginFalse = error => {
        if(error === undefined){
            Helpers.showToast('error', 'Oops... Không thể kết nối đến server!');
            setLoading(false);
            return false;
        }
        const {status} = error;
        switch (status) {
            case 403: {
                let errors = Object.keys(error.data.errors).reduce((current, next) => {
                    return {...current, [next]: error.data.errors[next].join(', ')}
                }, {overall: null});
                setErrors(errors);
                break;
            }
            case 401: {
                Helpers.showToast('error', error.data.message);
                break;
            }
            default: {
            }

        }
        setLoading(false);
    };
    const onSubmit = event => {
        event.preventDefault();
        setLoading(true);
        login({email, password}).then(
            fullFill => {
                Helpers.showLoading();
                handleLoginSuccess(fullFill);
            },
            error => {
                handleLoginFalse(error)
            });
    };

    return (
        <div className="ibox login-content" style={styles.loginContent}>
            <div className="text-center">
                <span style={styles.authHeadIcon}><i className="fa fa-user"/></span>
            </div>
            <h4 className="font-strong text-center mb-5">ĐĂNG NHẬP</h4>
            <LoginForm
                change={onChange}
                submit={onSubmit}
                email={email}
                password={password}
                emailError={errors.email}
                passwordError={errors.password}
                isLoading={loading}
            />
        </div>
    );
}

const styles = {
    cover: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(117, 54, 230, .1)'
    },
    loginContent: {
        maxWidth: '400px',
        margin: '100px auto 50px'
    },
    authHeadIcon: {
        position: 'relative',
        height: '60px',
        width: '60px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '30px',
        backgroundColor: '#fff',
        color: '#5c6bc0',
        boxShadow: '0 5px 20px #d6dee4',
        borderRadius: '50%',
        transform: 'translateY(-50%)',
        zIndex: 2
    },
};
const mapDispatchToProps = dispatch => ({storeToken: token => dispatch(storeToken(token))});
export default connect(null, mapDispatchToProps)(Index)