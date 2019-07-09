import {useState} from 'react';

function toggle(initial = false) {
    const [state, setState] = useState(initial);
    const changeState = () => {
        setState(!state);
    };
    return [state, changeState];
}

export default toggle;