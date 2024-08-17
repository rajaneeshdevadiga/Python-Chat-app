const socket = io();

function sendMessage() {
    const message = document.getElementById('message').value;
    const room = document.getElementById('room').value;
    const username = document.getElementById('username').value;

    if (message && room) {
        socket.emit('message', {
            room: room,
            data: message,
            username: username
        });
        document.getElementById('message').value = '';
    }
}

function joinRoom() {
    const room = document.getElementById('room').value;
    const username = document.getElementById('username').value;

    if (room && username) {
        socket.emit('join', {
            room: room,
            username: username
        });
    }
}

socket.on('message', function(msg) {
    const messages = document.getElementById('messages');
    messages.value += msg + '\n';
});
