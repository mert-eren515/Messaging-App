const sendButton = document.getElementById('send');
const exitButton = document.getElementById('exit');
const messageInput = document.getElementById('message');
const textScreen = document.getElementById('text-screen');

let lastMessageCount = 0; // Bunlar silinecek şuan bir şey deneniyor

function loadOldMessages() {
    fetch('/messages')
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            console.error('Error from server:', data.error);
            alert('Failed to load messages: ' + data.error);
            return;
        }

        if (data.messages.length === lastMessageCount) return; // Silinecek
        
        textScreen.value = ""; // Silinecek
        data.messages.forEach(message => {
            textScreen.value += `${message.user}: ${message.message}\t(${message.time})\n`;
        });

        lastMessageCount = data.messages.length; // Silinecek
        textScreen.scrollTop = textScreen.scrollHeight; // Silinecek
    })
    .catch(err => {
        console.error('Error loading messages:', err);
    });
}

loadOldMessages();

exitButton.addEventListener('click', () => {
    localStorage.removeItem('username');
    window.location.href = '/login.html';
});

sendButton.addEventListener('click', () => {
    const message = messageInput.value;

    if(!message) return;

    fetch('/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // Sadece giden veri string olur. Çünkü HTTP request body sadece string veya binary taşır.
        body: JSON.stringify({ username: localStorage.getItem('username'), message: message, time: new Date().toLocaleTimeString() })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            console.error('Error from server:', data.error);
            alert('Failed to send message: ' + data.error);
            return;
        }

        console.log('Message sent:', data.status);
        textScreen.value += data.username + ': ' + data.message + '\t(' + data.time + ')\n'; // Display the sent message on the screen

        // Clean the input field after sending the message
        messageInput.value = '';
    })
    .catch(err => {
        console.error('Error sending message:', err);
    });
});

setInterval(loadOldMessages, 3000); // Silinecek
