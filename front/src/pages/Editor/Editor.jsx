import './Editor.css';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Monaco from '@monaco-editor/react';
import { SocketContext } from '../../contexts/SocketContext';
import { useNavigate, useParams } from 'react-router-dom';
import { fetch } from '../../utils/exercises';
import Alert from '../../components/Alert/Alert';
import { createPortal } from 'react-dom';
import smileyPng from '../../assets/bright-smiley-yellow-emoji-file-png.png'
function Editor() {
    const { exercise } = useParams();
    const { socket } = useContext(SocketContext);
    const [exerciseObj, setExerciseObj] = useState();
    const [value, setValue] = useState('//Starting off empty');
    const [tempValue, setTempValue] = useState();
    const [role, setRole] = useState();
    const [customAlert, setCustomeAlert] = useState();
    const [cases, setCases] = useState();
    const [smiley, setSmiley] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        function handleRole(role) {
            if (localStorage.getItem('role')) {
                setRole(localStorage.getItem('role'))
            }
            else {
                localStorage.setItem('role', role);
                setRole(role);
            }
        }
        socket.on('role', handleRole);
        socket.emit('join-room', exercise);
        socket.emit('get-role', exercise);

        axios.post(fetch, { title: exercise })
            .then(({ data }) => {
                setExerciseObj(data);
                setValue(data.code.replace(/\\/g, '\\'));
                setTempValue(data.code.replace(/\\/g, '\\'));
                setCases(data.testCases);
            })
            .catch(err => console.log(err))

        socket.on('write', (value) => {
            setValue(value)
        })
        socket.on('connect', () => {
            if (socket.recovered) {
                if (role !== 'teacher') {
                    socket.volatile.emit('write', value, exercise);
                }
                setCustomeAlert('You have reconnected')
                console.log('re');
            }
        })

        socket.on('disconnect', () => {
            setCustomeAlert('You have disconnected')
            console.log('de');
        })

        return () => {
            socket.off('role');
            socket.off('write');
            socket.emit('leave-room', exercise);
            socket.off('connect');
            socket.off('disconnect');
            localStorage.removeItem('role');
        }
    }, [])
    function checkCode() {
        let passed = true;
        if (cases) {
            cases.forEach(({ input, output }) => {
                if (passed) {
                    if (Array.isArray(input) && Array.isArray(input[1])) {
                        if (eval(`(${value})(${input[0]}, [${input[1]}])`) !== output) {
                            passed = false;
                            setCustomeAlert('Incorrect, try again');
                        }
                    }
                    else {
                        if (typeof (input) === 'string') {
                            input = `'${input}'`
                        }
                        if (eval(`(${value})(${input})`) !== output) {
                            passed = false;
                            setCustomeAlert('Incorrect, try again');
                        }
                    }
                }
            })
        }
        if (passed) {
            if (value.replaceAll(/\s|;/g, '') === exerciseObj.solution.replaceAll(/\s|;/g, '')) {
                setSmiley(true);
                setTimeout(() => {
                    navigate('/');
                }, 3 * 1000);
            }
            else {
                setCustomeAlert('Almost there. ' + exerciseObj.hint);
            }
        }
    }
    function handleChange(value) {
        setValue(value)
        role !== 'teacher' && socket.volatile.emit('write', value, exercise)
    }
    function handleViewAnswer() {
        setValue(exerciseObj.solution)
    }
    function handleHideAnswer() {
        setValue(tempValue);
    }
    return (
        <div id="editor-main">
            <Monaco
                height="35vh"
                defaultLanguage="javascript"
                defaultValue={value}
                value={value}
                onChange={handleChange}
                options={{ readOnly: role === 'teacher' ? true : role === 'student' && false }}
                theme='vs-dark'
            />
            {role !== 'teacher'
                ?
                <button onClick={checkCode}>Run My Code</button>
                :
                tempValue !== value
                    ?
                    <button onClick={handleHideAnswer}>Hide Answer</button>
                    :
                    <button onClick={handleViewAnswer}>View Answer</button>
            }
            {cases &&
                <div id="test-cases">
                    <div id="input">input</div>
                    <div id="output">output</div>
                    {
                        cases.map(({ input, output }, index) => {
                            return (
                                <>
                                    <div key={index}>{Array.isArray(input) ? Array.isArray(input[1]) ? `${input[0]}, [${input[1]}]` : `${input[0]}, ${input[1]}` : input}</div>
                                    <div key={index}>{output.toString()}</div>
                                </>
                            )
                        })
                    }

                </div>
            }
            {customAlert && <Alert text={customAlert} setState={setCustomeAlert} />}
            {smiley &&
                createPortal(
                    <div id='smiley'>
                        <img src={smileyPng} alt="" />
                    </div>,
                    document.body
                )}
        </div>
    )
}
export default Editor;