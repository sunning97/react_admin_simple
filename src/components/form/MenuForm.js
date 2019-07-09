import React, {useEffect, useState} from 'react';
import {Button, Container, Form, Input, Label} from "reactstrap";
import InputWrapper from "../hoc/InputWrapper";
import classNames from 'classnames';

function MenuForm({data, submit, errors}) {
    const [name, setName] = useState('');
    const [apiPath, setApiPath] = useState('');
    const [icon, setIcon] = useState('');
    const [note, setNote] = useState('');
    const [targetOpen, setTargetOpen] = useState('_self');
    const [url, setUrl] = useState('');
    const [defaultErrors, setDefautErrors] = useState({...errors});
    useEffect(() => {
        if (data) {
            data.name && setName(data.name);
            data.api_path && setApiPath(data.api_path);
            data.icon && setIcon(data.icon);
            data.note && setNote(data.note);
            data.target_open && setTargetOpen(data.target_open);
            data.url && setUrl(data.url);
        }
    }, [data]);
    useEffect(() => {
        if (errors) setDefautErrors({...errors});
    }, [errors]);
    const onChange = event => {
        const name = event.target.name;
        switch (name) {
            case 'name': {
                setName(event.target.value);
                break;
            }
            case 'apiPath': {
                setApiPath(event.target.value);
                break;
            }
            case 'icon': {
                setIcon(event.target.value);
                break;
            }
            case 'note': {
                setNote(event.target.value);
                break;
            }
            case 'targetOpen': {
                setTargetOpen(event.target.value);
                break;
            }
            case 'url': {
                setUrl(event.target.value);
                break;
            }
            default: {

            }
        }
        if (defaultErrors[name])
            setDefautErrors({...defaultErrors, [name]: null});
    };
    return (
        <Form className={'clearfix'}
              onSubmit={submit.bind(this, {name, icon, note, url, api_path: apiPath, target_open: targetOpen})}>
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
                    <Label for={'icon'}>Icon class</Label>
                    <Input
                        value={icon}
                        type={'text'}
                        name={'icon'}
                        onChange={onChange}/>
                </InputWrapper>
                <InputWrapper className="offset-2 col-lg-8">
                    <Label for={'apiPath'}>Api path</Label>
                    <Input
                        value={apiPath}
                        type={'text'}
                        name={'apiPath'}
                        onChange={onChange}/>
                </InputWrapper>
                <InputWrapper className="offset-2 col-lg-8">
                    <Label for={'url'}>Url</Label>
                    <Input
                        value={url}
                        type={'text'}
                        name={'url'}
                        onChange={onChange}/>
                </InputWrapper>
                <InputWrapper className="offset-2 col-lg-8">
                    <Label for={'targetOpen'}>Mở trong</Label>
                    <Input
                        value={targetOpen}
                        type={'select'}
                        name={'targetOpen'}
                        onChange={onChange}>
                        <option value={'_self'}>Tab hiện tại</option>
                        <option value={'_else'}>Tab mới</option>
                    </Input>
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

export default MenuForm;