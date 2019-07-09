import React from 'react';
import LoginInput from "./LoginInput";
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

class LoginForm extends React.Component {
    render() {
        const {
            change,
            submit,
            emailError,
            email,
            passwordError,
            password,
            isLoading
        } = this.props;
        return (
            <form className="ibox-body" id="login-form">
                <LoginInput
                    disabled={isLoading}
                    onChange={change}
                    error={emailError}
                    className={'form-control form-control-line'}
                    type={'email'}
                    name={'email'}
                    placeholder={'Email'}
                    value={email}
                />
                <LoginInput
                    disabled={isLoading}
                    onChange={change}
                    error={passwordError}
                    className={'form-control form-control-line'}
                    type={'password'}
                    name={'password'}
                    placeholder={'Mật khẩu'}
                    value={password}
                />
                <BlockUi tag="div" blocking={isLoading}>
                    <div className="text-center mb-4">
                        <button className="btn btn-primary btn-rounded btn-block" onClick={submit}>
                            ĐĂNG NHẬP
                        </button>
                    </div>
                </BlockUi>
            </form>
        );
    }
}

export default LoginForm;