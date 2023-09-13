import { useEffect, useState } from 'react';
import './Alert.css';
import { createPortal } from 'react-dom';

function Alert({ children, text, setState }) {
    const [show, setShow] = useState(true);
    useEffect(() => {
        setShow(true)
        setTimeout(() => {
            setShow(false);
            setState(false);
        }, 4.96 * 1000);
    }, [])
    return show && createPortal(
        <div id='alert'>
            <div id="text">{text}</div>

        </div>,
        document.body)
}
export default Alert