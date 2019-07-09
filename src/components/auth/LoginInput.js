import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

const LoginInput = ({error,onChange,...rest}) => (
    <div className={`form-group mb-4 ${error ? 'has-error' : ''}`}>
        <Input
            {...rest}
            onChange={onChange}
        />
        {
            error &&
            <label
                className="help-block">
                <b>
                    {error}
                </b>
            </label>
        }
    </div>
);

LoginInput.proptTypes = {
    error: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
};

export default LoginInput;