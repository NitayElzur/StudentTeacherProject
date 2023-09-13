import './Editor.css';
import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import Monaco from '@monaco-editor/react';
import { SocketContext } from '../../contexts/SocketContext';
import { useParams } from 'react-router-dom';
import { fetch } from '../../utils/exercises';
function Editor() {
    const { exercise } = useParams();
    const { role, socket } = useContext(SocketContext);
    const [exerciseObj, setExerciseObj] = useState();
    const [value, setValue] = useState('//Starting off empty');
    useEffect(() => {
        socket.emit('join-room', exercise)
        socket.on('write', (value) => {
            setValue(value)
        })
        axios.post(fetch, { title: exercise })
            .then(({ data }) => {
                setExerciseObj(data);
                setValue(data.code.replace(/\\/g, '\\'));
            })
            .catch(err => console.log(err))
        socket.on('connect', () => {
            socket.emit('join-room', exercise);
        })
        return () => {
            socket.off('write');
            socket.off('connect');
        }
    }, [])
    function checkCode() {
        alert(value.replaceAll(/\s/g, '') === exerciseObj.solution.replaceAll(/\s/g, '') ? 'Correct!\nWell done.' : 'Incorrect\nTry again.\nRemember to remove all comments')
    }
    function handleChange(value) {
        setValue(value)
        role !== 'teacher' && socket.emit('write', value, exercise)
    }
    return (
        <div id="editor-main">
            <Monaco
                height="70vh"
                defaultLanguage="javascript"
                defaultValue={value}
                value={value}
                onChange={handleChange}
                options={{ readOnly: role === 'teacher' ? true : role === 'student' && false }}
                theme='vs-dark'
            />
            {role !== 'teacher' && <button onClick={checkCode}>Turn in my code</button>}
        </div>
    )
}
export default Editor;