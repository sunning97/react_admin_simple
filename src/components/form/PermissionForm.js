import React, {useEffect, useState} from 'react';
import {Button, Container, Form, Input, Label} from "reactstrap";
import InputWrapper from "../hoc/InputWrapper";
import classNames from 'classnames';

function PermissionForm({data = {}, submit, errors}) {
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [defaultErrors, setDefaultErrors] = useState({...errors});
    useEffect(() => {
        if (data) {
            setName(data.name);
            data.note && setNote(data.note);
        }
    }, [data]);
    useEffect(() => {
        if (errors) setDefaultErrors({...errors})
    }, [errors]);
    const onChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        switch (name) {
            case 'name': {
                setName(value);
                break;
            }
            case 'note': {
                setNote(value);
                break;
            }
            default: {
            }
        }
        if(defaultErrors[name])
            setDefaultErrors({...defaultErrors,[name]:null})
    };
    return (
        <Form className={'clearfix'} onSubmit={submit.bind(this, {name, note})}>
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

export default PermissionForm;