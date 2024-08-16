from flask import Flask, render_template, request
from flask_socketio import SocketIO, join_room, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# In-memory store for messages
chat_history = {}

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('message')
def handle_message(msg):
    room = msg['room']
    message = msg['data']
    username = msg.get('username', 'Anonymous')

    # Store message in memory
    if room not in chat_history:
        chat_history[room] = []
    chat_history[room].append(f"[{username}]: {message}")

    # Broadcast the message to other users in the room
    send(f"[{username}]: {message}", room=room)

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)

    # Send chat history to the user who joined
    if room in chat_history:
        for message in chat_history[room]:
            send(message, room=room)

    # Notify others in the room of the new participant
    send(f'{username} has entered the room.', room=room)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
