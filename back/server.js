const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://elzurnitay:1BuFh1Om8oZsEDpe@cluster0.maauh1s.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err))
app.use(express.json());
app.use(cors());
const exerciseRoute = require('./routes/exercise');

app.use('/exercise', exerciseRoute);

app.get('/', (req, res) => {
    res.status(200).send("Hello world");
})

const server = app.listen(3000, () => {
    console.log('Server is running');
})

require('dotenv').config();
const socketIO = require('socket.io')
const io = new socketIO.Server(server, {
    cors: {
        origin: process.env.SERVER,
        methods: ['GET', 'POST'],
        credentials: true
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true
    }
})
io.on('connection', socket => {
    console.log(socket.id + ' connected. total users: ' + io.engine.clientsCount);

    socket.on('disconnect', () => {
        console.log(socket.id + ' disconnected');
    })

    socket.on('reconnect', () => {
        console.log(`A client reconnected after ${attemptNumber} attempts`);
    })

    socket.on('reconnect_failed', () => {
        console.log('A client failed to reconnect');
    })

    socket.on('write', (value, room) => {
        socket.to(room).emit('write', value)
        console.log('update');
    })

    socket.on('join-room', (room) => {
        socket.join(room);
        socket.emit('role', io.sockets.adapter.rooms.get(room).size === 1 ? 'teacher' : 'student')
    })
})