export default {
  async fetch(request, env) {

    // ===== CHAT CON IA REAL =====
    if (request.method === "POST") {
      const { mensaje } = await request.json();

      const aiResponse = await env.AI.run(
        "@cf/meta/llama-3-8b-instruct",
        {
          messages: [
            {
              role: "system",
              content: "Eres Chen IA, un asistente amable, claro y respondes en español."
            },
            {
              role: "user",
              content: mensaje
            }
          ]
        }
      );

      return new Response(
        JSON.stringify({ respuesta: aiResponse.response }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // ===== HTML =====
    return new Response(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Chen IA</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background-image: url("https://wallpapercave.com/wp/wp10233889.jpg");
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      background-attachment: fixed;
      color: #fff;
    }

    .chat {
      max-width: 520px;
      height: 90vh;
      margin: 5vh auto;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(6px);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      padding: 15px;
    }

    h2 {
      text-align: center;
      margin: 5px 0 10px 0;
    }

    #log {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
    }

    .msg {
      max-width: 75%;
      padding: 10px 14px;
      margin-bottom: 10px;
      border-radius: 14px;
      line-height: 1.4;
      word-wrap: break-word;
    }

    .user {
      background: #22c55e;
      color: #000;
      margin-left: auto;
      border-bottom-right-radius: 4px;
    }

    .bot {
      background: #1f2937;
      color: #fff;
      margin-right: auto;
      border-bottom-left-radius: 4px;
    }

    .input-area {
      display: flex;
      gap: 6px;
    }

    input {
      flex: 1;
      padding: 10px;
      border-radius: 20px;
      border: none;
      outline: none;
    }

    button {
      padding: 10px 16px;
      border-radius: 20px;
      border: none;
      background: #22c55e;
      font-weight: bold;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="chat">
    <h2>🤖 Chen IA</h2>
    <div id="log"></div>

    <div class="input-area">
      <input id="msg" placeholder="Escribe un mensaje..." />
      <button onclick="enviar()">➤</button>
    </div>
  </div>

  <script>
    async function enviar() {
      const input = document.getElementById("msg");
      const log = document.getElementById("log");
      const texto = input.value.trim();
      if (!texto) return;

      const userMsg = document.createElement("div");
      userMsg.className = "msg user";
      userMsg.textContent = texto;
      log.appendChild(userMsg);

      input.value = "";
      log.scrollTop = log.scrollHeight;

      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: texto })
      });

      const data = await res.json();

      const botMsg = document.createElement("div");
      botMsg.className = "msg bot";
      botMsg.textContent = data.respuesta;
      log.appendChild(botMsg);

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
