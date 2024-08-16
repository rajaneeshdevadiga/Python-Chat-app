from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, send, emit
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    send(f'{username} has joined the room.', room=room)

@socketio.on('message')
def handle_message(data):
    room = data['room']
    username = data['username']

    if 'data' in data:
        message = f'{username}: {data["data"]}'
        send(message, room=room)

    if 'selfie' in data:
        selfie_message = {
            'username': username,
            'selfie': data['selfie']
        }
        emit('message', selfie_message, room=room)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
