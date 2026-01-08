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
            { role: "system", content: "Eres Chen IA, respondes en español de forma clara y amigable." },
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

    // HTML
    return new Response(`
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Chen IA</title>

<style>
/* Fondo tipo WhatsApp */
body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(
    135deg,
    #0b141a 0%,
    #111b21 40%,
    #202c33 100%
  );
}

/* Contenedor principal */
.chat {
  height: 100vh;
  max-width: 500px;
  margin: auto;
  display: flex;
  flex-direction: column;
  background: #0b141a;
}

/* Header */
.header {
  background: #202c33;
  color: #e9edef;
  padding: 12px;
  text-align: center;
  font-weight: bold;
  letter-spacing: 0.5px;
}

/* Área de mensajes */
#log {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  background: linear-gradient(
    180deg,
    #0b141a 0%,
    #111b21 100%
  );
}

/* Burbujas */
.bubble {
  max-width: 78%;
  padding: 10px 14px;
  margin-bottom: 8px;
  border-radius: 12px;
  line-height: 1.4;
  word-wrap: break-word;
  animation: fadeIn 0.2s ease-in;
}

.user {
  background: #005c4b;
  color: #e9edef;
  margin-left: auto;
  border-bottom-right-radius: 4px;
}

.bot {
  background: #202c33;
  color: #e9edef;
  margin-right: auto;
  border-bottom-left-radius: 4px;
}

/* Animación suave */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Área de entrada */
.input {
  display: flex;
  padding: 10px;
  background: #202c33;
  gap: 8px;
}

input {
  flex: 1;
  border-radius: 20px;
  border: none;
  padding: 10px 14px;
  background: #111b21;
  color: #e9edef;
  outline: none;
}

input::placeholder {
  color: #8696a0;
}

button {
  border: none;
  background: #00a884;
  color: #003f2e;
  border-radius: 20px;
  padding: 10px 16px;
  font-weight: bold;
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

  // Mensaje usuario
  const u = document.createElement("div");
  u.className = "bubble user";
  u.textContent = texto;
  log.appendChild(u);

  input.value = "";
  log.scrollTop = log.scrollHeight;

  // Indicador escribiendo
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
