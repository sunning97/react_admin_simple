import React, {useEffect, useState} from 'react';
import {Button, Container, Form, Input, Label} from "reactstrap";
import InputWrapper from "../hoc/InputWrapper";
import DropifyInput from "../DropifyInput";
import PropTypes from 'prop-types';
import classNames from 'classnames';

function SliderForm({data, submit, errors}) {
    const [title, setTitle] = useState(data && data.title ? data.title : '');
    const [image, setImage] = useState(data && data.image ? data.image : null);
    const [note, setNote] = useState(data && data.note ? data.note : '');
    const [description, setDescription] = useState(data && data.description ? data.description : '');
    const [status, setStatus] = useState(data && data.status ? data.status : 'show');
    const [imagePath, setImagePath] = useState(data && data.image_path ? data.image_path : null);
    const [defaultErrors, setDefaultErrors] = useState({...errors});
    const onChange = event => {
        const name = event.target.name;
        switch (name) {
            case 'title': {
                setTitle(event.target.value);
                break;
            }
            case 'image': {
                setImage(event.target.files[0]);
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
            case 'status': {
                setStatus(event.target.value);
                break;
            }
            default: {

            }
        }
        if (defaultErrors[name])
            setDefaultErrors({...defaultErrors, [name]: null});
    };
    const clearInput = (name, value) => {
        if (name === 'image') {
            setImage(value);
        }
    };
    useEffect(() => {
        if (data) {
            setTitle(data.title);
            setStatus(data.status);
            data.image_path && setImagePath(data.image_path);
            data.description && setDescription(data.description);
            data.note && setNote(data.note);
        }
    }, [data]);
    useEffect(() => {
        if (errors)
            setDefaultErrors({...errors})
    }, [errors]);
    return (
        <Form className={'clearfix'} onSubmit={submit.bind(this, {title, description, image, note, status})}>
            <Container>
                <InputWrapper className={classNames('offset-2 col-lg-8',{'has-error': defaultErrors && defaultErrors.title})}>
                    <Label for={'title'}>Tiêu đề <span className={'text-danger'}>*</span></Label>
                    <Input
                        type={'text'}
                        name={'title'}
                        value={title}
                        onChange={onChange}/>
                    {(defaultErrors && defaultErrors.title) && <p className="text-danger">{defaultErrors.title}</p>}
                </InputWrapper>
                <InputWrapper className={classNames('offset-2 col-lg-8',{'has-error':defaultErrors && defaultErrors.image})}>
                    <Label for={'image'}>Ảnh <span className={'text-danger'}>*</span></Label>
                    <DropifyInput
                        defaultImage={imagePath}
                        name={'image'}
                        onChange={onChange}
                        clear={clearInput}/>
                    {(defaultErrors && defaultErrors.image) && <p className="text-danger">{defaultErrors.image}</p>}
                </InputWrapper>
                <InputWrapper className={classNames('offset-2 col-lg-8',{'has-error':defaultErrors && defaultErrors.status})}>
                    <Label for={'status'}>Trạng thái <span className={'text-danger'}>*</span></Label>
                    <Input
                        value={status}
                        type={'select'}
                        name={'status'}
                        onChange={onChange}>
                        <option value={'show'}>Hiển thị</option>
                        <option value={'hide'}>Ẩn</option>
                    </Input>
                    {(defaultErrors && defaultErrors.status) && <p className="text-danger">{defaultErrors.status}</p>}
                </InputWrapper>
                <InputWrapper className="offset-2 col-lg-8">
                    <Label for={'description'}>Mô tả</Label>
                    <Input
                        value={description}
                        type={'input'}
                        name={'description'}
                        onChange={onChange}/>
                </InputWrapper>
                <InputWrapper className="offset-2 col-lg-8">
                    <Label for={'note'}>Ghi chú</Label>
                    <Input
                        value={note}
                        type={'textarea'}
                        name={'note'}
                        rows={5}
                        onChange={onChange}/>
                </InputWrapper>
                <InputWrapper className="offset-2 col-lg-8 text-right">
                    <Button type="submit" color="info"><i className={'ti-check mr-2'}/>Hoàn thành</Button>
                </InputWrapper>
            </Container>
        </Form>
    );
}

SliderForm.propTypes = {
    data: PropTypes.object,
    submit: PropTypes.func.isRequired,
    errors: PropTypes.object
};
export default SliderForm;