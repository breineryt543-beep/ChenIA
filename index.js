export default {
  async fetch(request, env) {

    // --- PETICIÓN DEL CHAT ---
    if (request.method === "POST") {
      const { mensaje } = await request.json();

      // Llamada a Workers AI (modelo de texto)
      const aiResponse = await env.AI.run(
        "@cf/meta/llama-3-8b-instruct",
        {
          messages: [
            {
              role: "system",
              content: "Eres Chen IA, un asistente amable y claro que responde en español."
            },
            {
              role: "user",
              content: mensaje
            }
          ]
        }
      );

      return new Response(
        JSON.stringify({
          respuesta: aiResponse.response
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // --- HTML ---
    return new Response(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Chen IA</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #0f172a;
      color: #e5e7eb;
    }
    .chat {
      max-width: 520px;
      margin: 40px auto;
      background: #020617;
      padding: 20px;
      border-radius: 8px;
    }
    input, button {
      width: 100%;
      padding: 10px;
      margin-top: 6px;
      border-radius: 4px;
      border: none;
    }
    button {
      background: #22c55e;
      cursor: pointer;
      font-weight: bold;
    }
    #log {
      background: #020617;
      padding: 10px;
      min-height: 220px;
      border-radius: 4px;
      overflow-y: auto;
    }
  </style>
</head>
<body>
  <div class="chat">
    <h2>🤖 Chen IA</h2>
    <div id="log"></div>
    <input id="msg" placeholder="Escribe tu mensaje..." />
    <button onclick="enviar()">Enviar</button>
  </div>

  <script>
    async function enviar() {
      const input = document.getElementById("msg");
      const log = document.getElementById("log");

      const texto = input.value.trim();
      if (!texto) return;

      log.innerHTML += "<p><b>Tú:</b> " + texto + "</p>";
      input.value = "";

      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: texto })
      });

      const data = await res.json();
      log.innerHTML += "<p><b>Chen IA:</b> " + data.respuesta + "</p>";
      log.scrollTop = log.scrollHeight;
    }
  </script>
</body>
</html>
    `, {
      headers: { "Content-Type": "text/html" }
    });
  }
};
