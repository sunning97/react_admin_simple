import React, {useEffect, useState} from 'react';
import {Button, Container, Form, Input, Label} from "reactstrap";
import InputWrapper from "../hoc/InputWrapper";
import classNames from 'classnames';
import PropTypes from 'prop-types';

function CategoryForm({data, isAddStayHere, submit, clear, errors}) {
    const [title, setTitle] = useState(data && data.title ? data.title : '');
    const [note, setNote] = useState(data && data.note ? data.note : '');
    const [description, setDescription] = useState(data && data.description ? data.description : '');
    const [status, setStatus] = useState(data && data.status ? data.status : 'show');
    const [stayHere, setStayHere] = useState(false);
    const [defaultErrors, setDefaultErrors] = useState({...errors});
    const onChange = event => {
        const value = event.target.value;
        const name = event.target.name;
        switch (name) {
            case 'title': {
                setTitle(value);
                break;
            }
            case 'note': {
                setNote(value);
                break;
            }
            case 'description': {
                setDescription(value);
                break;
            }
            case 'status': {
                setStatus(value);
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
            setDefaultErrors({...defaultErrors, [name]: null});
    };
    useEffect(() => {
        if (errors) setDefaultErrors({...errors})
    }, [errors]);
    //update all input when data was change
    useEffect(() => {
        if (data) {
            setTitle(data.title);
            setNote(data.note);
            setDescription(data.description);
            setStatus(data.status);
        }
    }, [data]);
    //clear all input when clear is change
    useEffect(() => {
        const clearAllInput = () => {
            setTitle('');
            setNote('');
            setDescription('');
            setStatus('show');
        };
        clearAllInput();
    }, [clear]);
    return (
        <Form className={'clearfix'} onSubmit={submit.bind(this, {title, status, note, description, stayHere})}>
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
                    <Label for={'description'}>Trạng thái</Label>
                    <Input
                        value={status}
                        onChange={onChange}
                        type={'select'}
                        name={'status'}>
                        <option value={'show'}>Hiển thị</option>
                        <option value={'hide'}>Không hiển thị</option>
                    </Input>
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
                    isAddStayHere && <InputWrapper className="offset-2 col-lg-8">
                    <span>
                        <label className="ui-switch switch-icon mr-2 mb-0">
                            <Input
                                type={'checkbox'}
                                name={'stayHere'}
                                onChange={onChange}
                                defaultChecked={false}/>
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
CategoryForm.propTypes = {
    data: PropTypes.object,
    isAddStayHere: PropTypes.bool,
    submit: PropTypes.func.isRequired,
    clear: PropTypes.bool,
    errors: PropTypes.object
};
export default CategoryForm;