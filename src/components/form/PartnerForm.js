import React, {useEffect, useState} from 'react'
import {Button, Container, Form, Input, Label} from "reactstrap";
import InputWrapper from "../hoc/InputWrapper";
import DropifyInput from "../DropifyInput";
import PropTypes from 'prop-types';
import classNames from 'classnames';

function PartnerForm({submit, data, errors}) {
    const [name, setName] = useState('');
    /* eslint-disable */
    const [image, setImage] = useState(null);
    const [website, setWebsite] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('show');
    const [note, setNote] = useState('');
    const [oldImage, setOldImage] = useState(null);
    const [defaultErrors, setDefaultErrors] = useState({...errors});
    const onChange = event => {
        const value = event.target.value;
        const name = event.target.name;
        switch (name) {
            case 'name': {
                setName(value);
                break;
            }
            case 'image': {
                setImage(event.target.files[0]);
                break;
            }
            case 'website': {
                setWebsite(value);
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
            case 'note': {
                setNote(value);
                break;
            }
            default: {
            }
        }
        if(defaultErrors[name])
            setDefaultErrors({...defaultErrors,[name]:null});
    };
    const clearImage = (name, value) => {
        setImage(value);
    };
    useEffect(() => {
        if (data) {
            setName(data.name);
            data.website && setWebsite(data.website);
            data.description && setDescription(data.description);
            data.status && setStatus(data.status);
            data.note && setNote(data.note);
            data.image_path && setOldImage(data.image_path);
        }
    }, [data]);
    useEffect(() => {
        if (errors) setDefaultErrors({...errors})
    }, [errors]);
    return (
        <Form className={'clearfix'} onSubmit={submit}>
            <Container>
                <InputWrapper className={classNames('offset-2 col-lg-8',{'has-error':defaultErrors && defaultErrors.name})}>
                    <Label for={'name'}>Tên <span className={'text-danger'}>*</span></Label>
                    <Input
                        type={'text'}
                        name={'name'}
                        value={name}
                        onChange={onChange}/>
                    {(defaultErrors && defaultErrors.name) && <p className="text-danger">{defaultErrors.name}</p>}
                </InputWrapper>
                <InputWrapper className={classNames('offset-2 col-lg-8',{'has-error': defaultErrors && defaultErrors.image})}>
                    <Label for={'image'}>Ảnh <span className={'text-danger'}>*</span></Label>
                    <DropifyInput
                        defaultImage={oldImage}
                        name={'image'}
                        onChange={onChange}
                        clear={clearImage}/>
                    {(defaultErrors && defaultErrors.image) && <p className="text-danger">{defaultErrors.image}</p>}
                </InputWrapper>
                <InputWrapper className="offset-2 col-lg-8">
                    <Label for={'status'}>Trạng thái <span className={'text-danger'}>*</span></Label>
                    <Input
                        value={status}
                        type={'select'}
                        name={'status'}
                        onChange={onChange}>
                        <option value={'show'}>Hiển thị</option>
                        <option value={'hide'}>Ẩn</option>
                    </Input>
                </InputWrapper>
                <InputWrapper className="offset-2 col-lg-8">
                    <Label for={'website'}>Website</Label>
                    <Input
                        value={website}
                        type={'input'}
                        name={'website'}
                        onChange={onChange}/>
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
    )
}

PartnerForm.propTypes = {
    submit: PropTypes.func.isRequired,
    data: PropTypes.object,
    errors: PropTypes.object
};
export default PartnerForm;