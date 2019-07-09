import React from 'react';
import {FormGroup} from "reactstrap";

const InputWrapper = ({children,...rest}) => (
    <FormGroup {...rest}>
        {children}
    </FormGroup>
);

export default InputWrapper;