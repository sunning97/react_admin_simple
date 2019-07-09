import {useState} from 'react';
function input(initial = '') {
    const [value,setValue] = useState(initial);
    return [value,setValue];
}
export default input;