import './Home.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { fetch } from '../../utils/exercises';
import { Link } from 'react-router-dom';

function Home() {
    const [exercises, setExercises] = useState();
    useEffect(() => {
        axios.post(fetch, {})
            .then(({ data }) => setExercises(data))
            .catch(err => console.log(err))
    }, [])
    function capitalize(str) {
        let arr = str.split(' ');
        arr = arr.map(value => {
            return value.charAt(0).toUpperCase() + value.slice(1)
        })
        return arr.join(' ')
    }
    return (
        <div id='home-main'>
            <h1>Welcome to our code solver site</h1>
            <h2>Click on one of our exercises to begin</h2>
            <div id="exercises">
                {exercises &&
                    exercises.map((value, index) => {
                        return (
                            <Link key={index} to={`editor/${value.title}`}>
                                <div className='exercise'>
                                    <h3>
                                        {capitalize(value.title)}
                                    </h3>
                                </div>
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}
export default Home;