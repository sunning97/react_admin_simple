import React, {useEffect, useState} from 'react';
import input from '../../hooks/input';
import toggle from '../../hooks/toggle';
import {Button, Container, Form, Input, Label} from "reactstrap";
import InputWrapper from "../hoc/InputWrapper";
import PropTypes from 'prop-types';
import classNames from 'classnames';

function TagForm({submit, addStayHere, isClear, data, errors}) {
    const [title, setTitle] = input(data && data.title ? data.title : '');
    const [note, setNote] = input(data && data.note ? data.note : '');
    const [description, setDescription] = input(data && data.description ? data.description : '');
    const [stayHere, setStayHere] = toggle(false);
    const [defaultErrors, setDefaultErrors] = useState({...errors});
    const onChange = event => {
        const name = event.target.name;
        switch (name) {
            case 'title': {
                setTitle(event.target.value);
                break;
            }
            case 'note': {
                setNote(event.target.value);
                break;
            }
            case 'description': {
                setDescription(event.target.value);
                break;
            }
            case 'stayHere': {
                setStayHere(event.target.checked);
                break;
            }
            default: {

            }
        }
        if (defaultErrors[name])
            setDefaultErrors({...defaultErrors, [event.target.name]: null});
    };
    useEffect(() => {
        const clearAllInput = () => {
            if (stayHere) {
                setTitle('');
                setDescription('');
                setNote('');
            }
        };
        clearAllInput();
    }, [isClear]);
    useEffect(() => {
        if (errors)
            setDefaultErrors(errors)
    }, [errors]);
    useEffect(()=>{
        if(data){
            if(data.title) setTitle(data.title);
            if(data.note) setNote(data.note);
            if(data.description) setDescription(data.description);
        }
    },[data]);
    return (
        <Form className={'clearfix'} onSubmit={submit.bind(this, {title, note, description, stayHere})}>
            <Container>
                <InputWrapper
                    className={classNames('offset-2 col-lg-8', {'has-error': defaultErrors && defaultErrors.title})}>
                    <Label for={'title'}>Tiêu đề <span className={'text-danger'}>*</span></Label>
                    <Input
                        value={title}
                        onChange={onChange}
                        type={'text'}
                        name={'title'}/>
                    {(defaultErrors && defaultErrors.title) && <p className="text-danger">{defaultErrors.title}</p>}
                </InputWrapper>
                <InputWrapper className="offset-2 col-lg-8">
                    <Label for={'description'}>Mô tả</Label>
                    <Input
                        value={description}
                        onChange={onChange}
                        type={'text'}
                        name={'description'}/>
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
                {
                    addStayHere && <InputWrapper className="offset-2 col-lg-8">
                    <span>
                        <label className="ui-switch switch-icon mr-2 mb-0">
                            <Input
                                type={'checkbox'}
                                name={'stayHere'}
                                onChange={onChange}
                                defaultChecked={stayHere}/>
                            <span/>
                        </label>
                        không chuyển hướng
                    </span>
                    </InputWrapper>
                }
                <InputWrapper className="offset-2 col-lg-8 text-right">
                    <Button type="submit" color="info"><i className={'ti-check mr-2'}/>Hoàn thành</Button>
                </InputWrapper>
            </Container>
        </Form>
    );
}

TagForm.propTypes = {
    submit: PropTypes.func.isRequired,
    isClear: PropTypes.bool,
    stayHere: PropTypes.bool,
    data: PropTypes.object,
    errors: PropTypes.object
};

export default TagForm;