document.getElementById('submitBtn').addEventListener('click', async function() {
    const inputText = document.getElementById('inputText').value;

    if(inputText) {
        const response = await fetch('https://api.ejemplo-ia.com/consultar', { // Cambia por la URL de tu IA
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: inputText }),
        });

        const data = await response.json();
        document.getElementById('response').innerText = data.respuesta; // Mostrar la respuesta de la IA
    }
});
