const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

let username = null

while (username == null || username == '') {
  username = prompt('What is your username?')
}

appendJoinMessage('You joined')
socket.emit('new-user', username)

socket.on('user-connected', username => {
  appendJoinMessage(`${username} joined`)
})

socket.on('user-disconnected', username => {
  appendJoinMessage(`${username} disconnected`)
})

socket.on('chat-message', data => {
  appendOthersMessage(data.username, data.message)
})

messageForm.addEventListener('submit', event => {
  event.preventDefault()
  const message = messageInput.value

  if (message == null || message === '') return

  appendMyMessage(message)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

function appendJoinMessage(message) {
  const messageElement = getMessageElement(message, 'join-message')
  messageContainer.append(messageElement)
}

function appendMyMessage(message) {
  const messageElement = getMessageElement(message, 'my-message')
  messageContainer.append(messageElement)
}

function appendOthersMessage(username, message) {
  const messageElement = getMessageElement(message, 'others-message')
  const messageSenderElement = getMessageSenderElement(username)
  messageElement.prepend(messageSenderElement)
  messageContainer.append(messageElement)
}

function getMessageElement(message, ...classList) {
  const messageElement = document.createElement('div')
  messageElement.classList.add('message', ...classList)
  messageElement.innerText = message
  return messageElement
}

function getMessageSenderElement(sender) {
  const messageSenderElement = document.createElement('div')
  messageSenderElement.classList.add('message-sender')
  messageSenderElement.innerText = sender
  return messageSenderElement
}