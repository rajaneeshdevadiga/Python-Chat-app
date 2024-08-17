const socket = io();

function sendMessage() {
    const message = document.getElementById('message').value;
    const room = document.getElementById('room').value;
    const username = document.getElementById('username').value;

    if (room && message) {
        const data = {
            room: room,
            username: username,
            data: message
        };
        socket.emit('message', data);
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

let videoStream = null;

function openCamera() {
    const cameraContainer = document.getElementById('camera-container');
    cameraContainer.style.display = 'block';

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            videoStream = stream;
            const video = document.getElementById('camera');
            video.srcObject = stream;
        })
        .catch(function (err) {
            alert('Unable to access camera: ' + err);
        });
}

function captureSelfie() {
    const video = document.getElementById('camera');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const selfieData = canvas.toDataURL('image/png');

    const room = document.getElementById('room').value;
    const username = document.getElementById('username').value;

    if (room) {
        socket.emit('message', {
            room: room,
            username: username,
            selfie: selfieData
        });
    }

    closeCamera();
}

function closeCamera() {
    const cameraContainer = document.getElementById('camera-container');
    cameraContainer.style.display = 'none';

    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
}

socket.on('message', function (msg) {
    const messages = document.getElementById('messages');
    let messageHtml = '';

    if (msg.data) {
        messageHtml += msg.data + '\n';
    }

    if (msg.selfie) {
        messageHtml += `<img src="${msg.selfie}" class="selfie" alt="Selfie">`;
    }

    messages.value += messageHtml + '\n';
});
