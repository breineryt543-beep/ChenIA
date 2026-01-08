export default {
  async fetch(request, env) {

    // ===== MENSAJES =====
    if (request.method === "POST") {
      const form = await request.json();
      const mensaje = form.mensaje || "";

      const ai = await env.AI.run(
        "@cf/meta/llama-3-8b-instruct",
        {
          messages: [
            {
              role: "system",
              content: "Eres Chen IA, un asistente amable, claro y respondes en español."
            },
            { role: "user", content: mensaje }
          ]
        }
      );

      return new Response(
        JSON.stringify({ respuesta: ai.response }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // ===== HTML =====
    return new Response(`
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Chen IA</title>

<style>
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #0b141a;
}

/* Fondo tipo WhatsApp */
.app {
  background-image: url("https://i.imgur.com/8YqGZQp.png");
  background-size: cover;
  height: 100vh;
  display: flex;
  justify-content: center;
}

/* Contenedor */
.chat {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  background: rgba(0,0,0,.2);
}

/* Header */
.header {
  background: #202c33;
  color: #fff;
  padding: 10px;
  text-align: center;
  font-weight: bold;
}

/* Mensajes */
#log {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.bubble {
  max-width: 75%;
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 10px;
  word-wrap: break-word;
}

.user {
  background: #005c4b;
  color: #fff;
  margin-left: auto;
  border-bottom-right-radius: 2px;
}

.bot {
  background: #202c33;
  color: #fff;
  margin-right: auto;
  border-bottom-left-radius: 2px;
}

/* Escribiendo */
.typing {
  font-size: 13px;
  opacity: .7;
  margin-bottom: 8px;
}

/* Input */
.input {
  display: flex;
  align-items: center;
  padding: 8px;
  background: #202c33;
  gap: 6px;
}

.input input[type=text] {
  flex: 1;
  border-radius: 20px;
  border: none;
  padding: 10px;
  outline: none;
}

.input button {
  border: none;
  background: #00a884;
  color: #000;
  padding: 10px 14px;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
}

/* Responsive PC */
@media (min-width: 768px) {
  .chat {
    margin: 20px;
    border-radius: 10px;
    overflow: hidden;
  }
}
</style>
</head>

<body>
<div class="app">
  <div class="chat">
    <div class="header">💬 Chen IA</div>
    <div id="log"></div>

    <div class="input">
      📎
      <input id="msg" type="text" placeholder="Escribe un mensaje…" />
      <button onclick="enviar()">➤</button>
    </div>
  </div>
</div>

<script>
async function enviar() {
  const input = document.getElementById("msg");
  const log = document.getElementById("log");
  const texto = input.value.trim();
  if (!texto) return;

  // Mensaje usuario
  const u = document.createElement("div");
  u.className = "bubble user";
  u.textContent = texto;
  log.appendChild(u);
  input.value = "";

  // Escribiendo…
  const typing = document.createElement("div");
  typing.className = "typing";
  typing.textContent = "Chen IA está escribiendo…";
  log.appendChild(typing);
  log.scrollTop = log.scrollHeight;

  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mensaje: texto })
  });

  const data = await res.json();
  typing.remove();

  // Respuesta IA
  const b = document.createElement("div");
  b.className = "bubble bot";
  b.textContent = data.respuesta;
  log.appendChild(b);
  log.scrollTop = log.scrollHeight;
}

// Enviar con Enter
document.getElementById("msg").addEventListener("keydown", e => {
  if (e.key === "Enter") enviar();
});
</script>
</body>
</html>
    `, { headers: { "Content-Type": "text/html" } });
  }
};
