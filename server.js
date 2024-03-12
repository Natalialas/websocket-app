const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});
const io = socket(server);

const messages = []
const users = []

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);

    socket.on('join', (userName) => {
        users.push({ name: userName, id: socket.id });
        console.log('User ' + userName + ' with id ' + socket.id + ' has joined.');
        console.log('Current users:', users);
        socket.broadcast.emit('newUser', userName);
    });

    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('Oh, socket ' + socket.id + ' has left');

        const index = users.findIndex(user => user.id === socket.id);
        if (index !== -1) {
            const userName = users[index].name;
            console.log('User ' + userName + ' with id ' + socket.id + ' has left.');
            users.splice(index, 1);
            console.log('Current users:', users);
            socket.broadcast.emit('userLeft', userName);
        }
    });

    console.log('I\'ve added a listener on message event \n');
});

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.use((req, res) => {
    res.status(404).json({ message: 'Not found...' });
});