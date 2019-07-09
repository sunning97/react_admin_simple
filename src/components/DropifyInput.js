import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Input,} from "reactstrap";
import 'dropify/dist/css/dropify.min.css';
import $ from 'jquery';
import 'dropify/dist/js/dropify.min';

function DropifyInput({defaultImage, clear, name, onChange}) {
    const input = React.createRef();
    const setImageDefault = () => {
        const dropifyPreview = document.getElementsByClassName('dropify-preview')[0];
        const dropifyRender = dropifyPreview.getElementsByClassName('dropify-render')[0];
        const dropifyClear = document.getElementsByClassName('dropify-clear')[0];
        const dropifyFilenameInner = dropifyPreview.getElementsByClassName('dropify-filename-inner')[0];
        if (defaultImage) {
            dropifyRender.innerHTML = `<img src="${defaultImage}">`;
            dropifyPreview.style.display = 'block';
        }
        dropifyClear.addEventListener('click', () => {
            clear(name, null);
            if (defaultImage) {
                dropifyRender.innerHTML = `<img src="${defaultImage}">`;
                dropifyFilenameInner.innerText = '';
                dropifyPreview.style.display = 'block';
            }
        })
    };
    useEffect(() => {
        $(input.current).dropify();
        setImageDefault();
    }, [defaultImage]);
    return <Input
        type={'file'}
        name={name}
        innerRef={input}
        onChange={onChange}
        accept={'Image/*'}
    />
}

DropifyInput.propTypes = {
    name: PropTypes.string.isRequired,
    defaultImage: PropTypes.string
};

export default DropifyInput;