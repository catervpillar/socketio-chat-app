const socket = io('http://localhost:3000')
const roomContainer = document.getElementById('room-container')
const messageContainer = document.getElementById('message-container')
const scrollToBottomButton = document.getElementById('scrollToBottomButton')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

let newMessageCount = 0
let userScrolledUp = false

if (messageForm != null) {
  const name = prompt('What is your name?')
  appendJoinMessage('You joined')
  socket.emit('new-user', roomName, name)

  messageForm.addEventListener('submit', event => {
    event.preventDefault()
    const message = messageInput.value

    if (message == null || message === '') return

    appendMyMessage(message)
    scrollToBottom()
    socket.emit('send-chat-message', roomName, message)
    messageInput.value = ''
  })
}

if (messageContainer != null) {
  messageContainer.addEventListener("scroll", () => {
    // Check if the user has scrolled up
    userScrolledUp = messageContainer.scrollTop < messageContainer.scrollHeight - messageContainer.clientHeight

    if (userScrolledUp && newMessageCount > 0) {
      scrollToBottomButton.style.display = "block"
    } else {
      scrollToBottomButton.style.display = "none"
      newMessageCount = 0
    }
  })
}

if (scrollToBottomButton != null) {
  scrollToBottomButton.addEventListener("click", () => {
    scrollToBottom()
    scrollToBottomButton.style.display = "none"
    newMessageCount = 0
    userScrolledUp = false
  })
}

socket.on('room-created', room => {
  const roomElement = document.createElement('div')
  roomElement.innerText = room
  const roomLink = document.createElement('a')
  roomLink.href = `/${room}`
  roomLink.innerText = 'Join'
  roomContainer.append(roomElement, roomLink)
})

socket.on('user-connected', name => {
  appendJoinMessage(`${name} joined`)
})

socket.on('user-disconnected', name => {
  appendJoinMessage(`${name} disconnected`)
})

socket.on('chat-message', data => {
  appendOthersMessage(data.name, data.message)

  // Increment the new message count if the user has scrolled up
  if (userScrolledUp) {
    newMessageCount++
    scrollToBottomButton.innerText = `New Messages (${newMessageCount})`
    scrollToBottomButton.style.display = "block"
  } else {
    scrollToBottomButton.style.display = "none"
    scrollToBottom() // Scroll to the bottom if the user is at the bottom
  }
})

function appendJoinMessage(message) {
  const messageElement = getMessageElement(message, 'join-message')
  messageContainer.append(messageElement)
}

function appendMyMessage(message) {
  const messageElement = getMessageElement(message, 'my-message')
  messageContainer.append(messageElement)
}

function appendOthersMessage(name, message) {
  const messageElement = getMessageElement(message, 'others-message')
  const messageSenderElement = getMessageSenderElement(name)
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

function scrollToBottom() {
  messageContainer.scrollTop = messageContainer.scrollHeight
}

function userHasScrolledUp() {
  return messageContainer.scrollTop < messageContainer.scrollHeight - messageContainer.clientHeight
}