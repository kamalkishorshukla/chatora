// DOM Elements
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');
const newChatBtn = document.getElementById('new-chat-btn');
const chatList = document.getElementById('chat-list');
const chatTitle = document.querySelector('.chat-title');

// State
let currentChat = null;
let chats = JSON.parse(localStorage.getItem('chats')) || [];

// Initialize the application
function init() {
    loadChats();
    setupEventListeners();
    autoResizeTextarea();
}

// Event Listeners
function setupEventListeners() {
    messageForm.addEventListener('submit', handleMessageSubmit);
    newChatBtn.addEventListener('click', createNewChat);
    messageInput.addEventListener('input', autoResizeTextarea);
}

// Handle message submission
function handleMessageSubmit(e) {
    e.preventDefault();
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    if (!currentChat) {
        currentChat = createNewChat();
    }
    
    addMessage(message, 'sent');
    messageInput.value = '';
    autoResizeTextarea();
    
    // Simulate received message (replace with actual backend integration)
    setTimeout(() => {
        addMessage('This is a simulated response message.', 'received');
    }, 1000);
    
    saveChats();
}

// Create a new chat
function createNewChat() {
    const chat = {
        id: Date.now(),
        messages: [],
        title: 'New Chat',
        timestamp: new Date().toISOString()
    };
    
    chats.push(chat);
    currentChat = chat;
    updateChatList();
    clearChatMessages();
    updateChatTitle(chat.title);
    
    return chat;
}

// Add a message to the current chat
function addMessage(text, type) {
    if (!currentChat) return;
    
    const message = {
        text,
        type,
        timestamp: new Date().toISOString()
    };
    
    currentChat.messages.push(message);
    displayMessage(message);
    scrollToBottom();
}

// Display a message in the chat
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', message.type);
    messageElement.textContent = message.text;
    chatMessages.appendChild(messageElement);
}

// Clear chat messages
function clearChatMessages() {
    chatMessages.innerHTML = '';
}

// Update chat list in sidebar
function updateChatList() {
    chatList.innerHTML = '';
    
    chats.forEach(chat => {
        const chatElement = document.createElement('div');
        chatElement.classList.add('chat-item');
        if (currentChat && currentChat.id === chat.id) {
            chatElement.classList.add('active');
        }
        
        chatElement.innerHTML = `
            <div class="chat-item-content">
                <h3>${chat.title}</h3>
                <p>${new Date(chat.timestamp).toLocaleDateString()}</p>
            </div>
            <button class="delete-chat" data-id="${chat.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        // Add click event for chat selection
        chatElement.querySelector('.chat-item-content').addEventListener('click', () => {
            if (!chatElement.classList.contains('active')) {
                selectChat(chat);
            }
        });

        // Add click event for delete button
        chatElement.querySelector('.delete-chat').addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent chat selection when clicking delete
            deleteChat(chat.id);
        });
        
        chatList.appendChild(chatElement);
    });
}

// Select a chat
function selectChat(chat) {
    currentChat = chat;
    clearChatMessages();
    chat.messages.forEach(message => displayMessage(message));
    updateChatTitle(chat.title);
    updateChatList();
    scrollToBottom();
}

// Update chat title
function updateChatTitle(title) {
    chatTitle.querySelector('h1').textContent = title;
    chatTitle.querySelector('p').textContent = 'Active conversation';
}

// Save chats to localStorage
function saveChats() {
    localStorage.setItem('chats', JSON.stringify(chats));
}

// Load chats from localStorage
function loadChats() {
    if (chats.length > 0) {
        currentChat = chats[chats.length - 1];
        selectChat(currentChat);
    }
}

// Auto-resize textarea
function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    messageInput.style.height = messageInput.scrollHeight + 'px';
}

// Scroll to bottom of chat
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Update active section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });

            // Update active nav link
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${targetId}`) {
                    link.classList.add('active');
                }
            });
        });
    });

    // Handle form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your form submission logic here
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
});

// Delete a chat
function deleteChat(chatId) {
    if (confirm('Are you sure you want to delete this chat?')) {
        // Remove chat from array
        chats = chats.filter(chat => chat.id !== chatId);
        
        // If deleted chat was current chat, select another chat or create new one
        if (currentChat && currentChat.id === chatId) {
            if (chats.length > 0) {
                currentChat = chats[chats.length - 1];
                selectChat(currentChat);
            } else {
                currentChat = null;
                clearChatMessages();
                updateChatTitle('Welcome to Chatora', 'Start a new conversation or select an existing chat');
            }
        }
        
        // Update UI and save changes
        updateChatList();
        saveChats();
    }
}

// Initialize the application
init(); 