const sendButton = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

function addMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(sender === 'user' ? "user-message" : "ai-message");
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendButton.addEventListener("click", () => {
    const message = userInput.value.trim();

    if (message) {
        addMessage(message, 'user');

        const aiResponse = "Esta es una respuesta simulada de la IA.";

        setTimeout(() => {
            addMessage(aiResponse, 'ai');
        }, 1000);

        userInput.value = "";
    }
});

userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendButton.click();
    }
});
