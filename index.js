document.getElementById('submitBtn').addEventListener('click', async function() {
    const inputText = document.getElementById('inputText').value;

    if(inputText) {
        const response = await fetch('https://api.openai.com/v1/completions', {  // Usa una API pública de IA
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer TU_API_KEY'  // Necesitarás tu clave de API aquí
            },
            body: JSON.stringify({
                model: "text-davinci-003",  // Usa el modelo de GPT o el que sea disponible
                prompt: inputText,
                max_tokens: 100
            })
        });

        const data = await response.json();
        const aiResponse = data.choices[0].text.trim();  // La respuesta de la IA

        document.getElementById('response').innerText = aiResponse;  // Muestra la respuesta de la IA
    }
});
