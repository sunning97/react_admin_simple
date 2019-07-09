import React, {useEffect, useState} from 'react';
import {Button, Container, Form, Input, Label} from "reactstrap";
import InputWrapper from "../hoc/InputWrapper";
import input from '../../hooks/input';
import classNames from 'classnames';
import PropsTypes from 'prop-types';

function MenuTypeForm({data, submit, errors}) {
    const [name, setName] = input('');
    const [note, setNote] = input('');
    const [defaultErrors, setDefaultErrors] = useState({...errors});
    useEffect(() => {
        if (data) {
            data.name && setName(data.name);
            data.note && setNote(data.note);
        }
    }, [data]);
    useEffect(() => {
        if (errors) setDefaultErrors({...errors})
    }, [errors]);
    const onChange = event => {
        const name = event.target.name;
        switch (name) {
            case 'name': {
                setName(event.target.value);
                break;
            }
            case 'note': {
                setNote(event.target.value);
                break;
            }
            default: {
            }
        }
        if (defaultErrors[name]) setDefaultErrors({...defaultErrors, [name]: null})
    };
    return (
        <Form className={'clearfix'} onSubmit={submit.bind(this, {note, name})}>
            <Container>
                <InputWrapper className={classNames('offset-2 col-lg-8',{'has-error': defaultErrors && defaultErrors.name})}>
                    <Label for={'name'}>Tên <span className={'text-danger'}>*</span></Label>
                    <Input
                        value={name}
                        type={'text'}
                        name={'name'}
                        onChange={onChange}/>
                    {(defaultErrors && defaultErrors.name) && <p className="text-danger">{defaultErrors.name}</p>}
                </InputWrapper>
                <InputWrapper className="offset-2 col-lg-8">
                    <Label for={'note'}>Ghi chú</Label>
                    <Input
                        value={note}
                        type={'textarea'}
                        name={'note'}
                        rows={4}
                        onChange={onChange}/>
                </InputWrapper>
                <InputWrapper className="offset-2 col-lg-8 text-right">
                    <Button type="submit" color="info"><i className={'ti-check mr-2'}/>Hoàn thành</Button>
                </InputWrapper>
            </Container>
        </Form>
    );
}
MenuTypeForm.propTypes = {
    errors: PropsTypes.object,
    data: PropsTypes.object,
    submit: PropsTypes.func.isRequired
};
export default MenuTypeForm;