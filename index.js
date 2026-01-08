export default {
  async fetch(request, env) {

    // Evitar caché
    const headersNoCache = {
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0"
    };

    // Chat IA
    if (request.method === "POST") {
      const { mensaje } = await request.json();

      const ai = await env.AI.run(
        "@cf/meta/llama-3-8b-instruct",
        {
          messages: [
            { role: "system", content: "Eres Chen IA y respondes en español." },
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

    // Página HTML
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
  background-image: url("https://i.imgur.com/zLkG9hX.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #fff;
}

/* Contenedor general del chat */
.chat {
  height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: auto;
  background: rgba(0, 0, 0, 0.4);
}

/* Cabecera */
.header {
  background: #202c33;
  color: #fff;
  padding: 12px;
  text-align: center;
  font-weight: bold;
}

/* Área de mensajes */
#log {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

/* Burbujas */
.bubble {
  max-width: 75%;
  padding: 10px 14px;
  margin-bottom: 8px;
  border-radius: 12px;
  word-wrap: break-word;
}
.user {
  background: #25d366;
  color: #000;
  margin-left: auto;
}
.bot {
  background: #202c33;
  color: #fff;
  margin-right: auto;
}

/* Área de entrada */
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
  outline: none;
}
button {
  border: none;
  background: #00a884;
  border-radius: 20px;
  padding: 10px 14px;
  cursor: pointer;
}
</style>
</head>

<body>
<div class="chat">
  <div class="header">💬 Chen IA</div>
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

  const typing = document.createElement("div");
  typing.className = "bubble bot";
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
    `, {
      headers: {
        "Content-Type": "text/html",
        ...headersNoCache
      }
    });
  }
};
