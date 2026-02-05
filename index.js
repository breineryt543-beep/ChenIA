document.getElementById('send-btn').addEventListener('click', () => {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim()) {
        addMessageToChat(userInput, 'user');
        getChenIAResponse(userInput);
    }
    document.getElementById('user-input').value = ''; // Limpiar el campo
});

function addMessageToChat(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender);
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Hacer scroll hacia abajo
}

function getChenIAResponse(userInput) {
    const responses = [
        "Estoy aprendiendo mucho sobre ti.",
        "¡Eso suena interesante! Cuéntame más.",
        "¿Sabías que las IAs están mejorando cada día?",
        "Hmm... no estoy seguro de eso, pero podríamos investigarlo.",
        "Lo intentaré, pero aún estoy en entrenamiento."
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    setTimeout(() => {
        addMessageToChat(randomResponse, 'ia');
    }, 1000);
}
