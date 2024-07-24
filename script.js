const socket = io('http://localhost:3000');

const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const table = document.getElementById('table')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let drawing = false

const name = 'User' //prompt('Enter your name')
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('chat-message', (data) => {
    appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', (name) => {
    appendMessage(`${name} joined`)
})

socket.on('user-disconnected', (name) => {
    appendMessage(`${name} disconnected`)
})

messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', message)
    messageInput.value = ''
})

function appendMessage(message){
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
}


canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
document.getElementById('clearbtn').addEventListener('click', ()=>{
    clearCanvas()
    socket.emit('clear-board')
})

function startDrawing(e) {
    drawing = true;
    draw(e);
}

function draw(e) {
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();

    socket.emit('draw', { x, y });
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

function clearCanvas(){
    ctx.clearRect(0,0, canvas.clientWidth, canvas.height)
}

socket.on('draw', (data) => {
    drawOnCanvas(data);
});
socket.on('clear-board', () => {
    clearCanvas();
});

function drawOnCanvas(data) {
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
}