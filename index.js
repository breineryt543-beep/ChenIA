export default {
  async fetch(request, env) {

    // ---- DESACTIVAR CACHÉ ----
    const headersNoCache = {
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0"
    };

    // ---- CHAT ----
    if (request.method === "POST") {
      const { mensaje } = await request.json();

      const ai = await env.AI.run(
        "@cf/meta/llama-3-8b-instruct",
        {
          messages: [
            { role: "system", content: "Eres Chen IA, respondes en español." },
            { role: "user", content: mensaje }
          ]
        }
      );

      return new Response(
        JSON.stringify({ respuesta: ai.response }),
        {
          headers: {
            "Content-Type": "application/json",
            ...headersNoCache
          }
        }
      );
    }

    // ---- HTML ----
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
  background: #075e54;
}

.chat {
  height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: auto;
  background: #0b141a;
}

.header {
  background: #202c33;
  color: white;
  padding: 12px;
  text-align: center;
  font-weight: bold;
}

#log {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background-image: url("https://i.imgur.com/8YqGZQp.png");
  background-size: cover;
}

.bubble {
  max-width: 75%;
  padding: 10px 14px;
  margin-bottom: 8px;
  border-radius: 12px;
  word-wrap: break-word;
}

.user {
  background: #005c4b;
  color: white;
  margin-left: auto;
}

.bot {
  background: #202c33;
  color: white;
  margin-right: auto;
}

.input {
  display: flex;
  padding: 8px;
  background: #202c33;
  gap: 6px;
}

input {
  flex: 1;
  border-radius: 20px;
  border: none;
  padding: 10px;
}

button {
  border: none;
  background: #00a884;
  border-radius: 20px;
  padding: 10px 16px;
  cursor: pointer;
}
</style>
</head>

<body>
<div class="chat">
  <div class="header">🚨 CHEN IA NUEVA 🚨</div>
  <div id="log"></div>
  <div class="input">
    <input id="msg" placeholder="Escribe un mensaje…" />
    <button onclick="enviar()">➤</button>
  </div>
</div>

<script>
async function enviar() {
  const input = document.getElementById("msg");
  const log = document.getElementById("log");
  const texto = input.value.trim();
  if (!texto) return;

  const u = document.createElement("div");
  u.className = "bubble user";
  u.textContent = texto;
  log.appendChild(u);

  input.value = "";
  log.scrollTop = log.scrollHeight;

  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mensaje: texto })
  });

  const data = await res.json();

  const b = document.createElement("div");
  b.className = "bubble bot";
  b.textContent = data.respuesta;
  log.appendChild(b);
  log.scrollTop = log.scrollHeight;
}
</script>
</body>
</html>
    `, {
      headers: {
        "Content-Type": "text/html",
        ...headersNoCache
      }
    });
  }
};
