import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Container, Form, Input, Label} from "reactstrap";
import InputWrapper from "../hoc/InputWrapper";
import classNames from 'classnames';

function RoleForm({data = {},submit,errors}) {
    const [name, setName] = useState(data.name ? data.name : '');
    const [note, setNote] = useState(data.note ? data.note : '');
    const [defaultErrors,setDefaultErrors] = useState({...errors});
    const onChange = event => {
        const value = event.target.value;
        const name = event.target.name;
        switch (name) {
            case 'name':{
                setName(value);
                break;
            }
            case 'note':{
                setNote(value);
                break;
            }
            default:{

            }
        }
        if(defaultErrors[name])
            setDefaultErrors({...defaultErrors,[name]: null})
    };
    useEffect(()=>{
        if(errors) setDefaultErrors({...errors});
    },[errors]);
    useEffect(()=>{
        if(data){
            setName(data.name);
            if(data.note) setNote(data.note);
        }
    },[data]);
    return (
        <Form className={'clearfix'} onSubmit ={submit.bind(this,{name,note})}>
            <Container>
                <InputWrapper className={classNames('offset-2 col-lg-8',{'has-error': defaultErrors && defaultErrors.name})}>
                    <Label for={'name'}>Tên <span className={'text-danger'}>*</span></Label>
                    <Input
                        value={name}
                        onChange={onChange}
                        type={'text'}
                        name={'name'}/>
                    {(defaultErrors && defaultErrors.name) && <p className="text-danger">{defaultErrors.name}</p>}
                </InputWrapper>
                <InputWrapper className="offset-2 col-lg-8">
                    <Label for={'name'}>Ghi chú</Label>
                    <Input
                        value={note}
                        onChange={onChange}
                        rows={5}
                        type={'textarea'}
                        name={'note'}/>
                </InputWrapper>
                <InputWrapper className="offset-2 col-lg-8 text-right">
                    <Button type="submit" color="info"><i className={'ti-check mr-2'}/>Hoàn thành</Button>
                </InputWrapper>
            </Container>
        </Form>
    );
}

RoleForm.propTypes = {
    data: PropTypes.object,
    submit: PropTypes.func.isRequired,
    errors: PropTypes.object
};
export default RoleForm;