import React from 'react';
import {Input} from 'reactstrap';
import PropTypes from 'prop-types';

const LoginCheckbox = ({onChange,auto,...rest})=>(
    <span>
        <label className="ui-switch switch-icon mr-2 mb-0">
            <Input
                {...rest}
                onChange={onChange}
                defaultChecked={auto ? auto : false}/>
            <span/>
        </label>
        Giữ đăng nhập
    </span>
);

LoginCheckbox.propTypes = {
    onChange:PropTypes.func.isRequired,
};

export default LoginCheckbox;

