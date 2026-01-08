export default {
  async fetch(request, env) {

    const noCache = {
      "Cache-Control": "no-store"
    };

    // ===== IA =====
    if (request.method === "POST") {
      const { mensaje } = await request.json();

      const ai = await env.AI.run(
        "@cf/meta/llama-3-8b-instruct",
        {
          messages: [
            { role: "system", content: "Eres Chen IA, amable y clara." },
            { role: "user", content: mensaje }
          ]
        }
      );

      return new Response(JSON.stringify({
        respuesta: ai.response
      }), {
        headers: {
          "Content-Type": "application/json",
          ...noCache
        }
      });
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
  font-family: system-ui;
  background: linear-gradient(270deg,#0b141a,#111b21,#202c33);
  background-size: 600% 600%;
  animation: fondo 15s ease infinite;
}

@keyframes fondo {
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}

.chat {
  max-width: 500px;
  height: 100vh;
  margin: auto;
  display: flex;
  flex-direction: column;
  background: #0b141a;
}

.header {
  background:#202c33;
  color:#e9edef;
  padding:12px;
  text-align:center;
  font-weight:bold;
}

#log {
  flex:1;
  padding:10px;
  overflow-y:auto;
}

.bubble {
  max-width:75%;
  padding:10px 14px;
  margin-bottom:8px;
  border-radius:12px;
}

.user {
  background:#005c4b;
  color:#fff;
  margin-left:auto;
}

.bot {
  background:#202c33;
  color:#fff;
}

.input {
  display:flex;
  gap:6px;
  padding:8px;
  background:#202c33;
}

input {
  flex:1;
  border-radius:20px;
  border:none;
  padding:10px;
}

button {
  border:none;
  border-radius:20px;
  padding:10px 14px;
  background:#00a884;
  cursor:pointer;
}
</style>
</head>

<body>
<div class="chat">
  <div class="header">💬 Chen IA</div>
  <div id="log"></div>

  <div class="input">
    <button onclick="hablar()">🎤</button>
    <input id="msg" placeholder="Escribe o habla…" />
    <button onclick="enviar()">➤</button>
  </div>
</div>

<script>
const log = document.getElementById("log");
const input = document.getElementById("msg");

// ===== VOZ A TEXTO =====
function hablar() {
  const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  rec.lang = "es-ES";
  rec.start();
  rec.onresult = e => {
    input.value = e.results[0][0].transcript;
    enviar();
  };
}

// ===== TEXTO A VOZ =====
function hablarIA(texto) {
  const voz = new SpeechSynthesisUtterance(texto);
  voz.lang = "es-ES";
  speechSynthesis.speak(voz);
}

// ===== CHAT =====
async function enviar() {
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

  const res = await fetch("/", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ mensaje:texto })
  });

  const data = await res.json();
  typing.remove();

  const b = document.createElement("div");
  b.className = "bubble bot";
  b.textContent = data.respuesta;
  log.appendChild(b);
  log.scrollTop = log.scrollHeight;

  hablarIA(data.respuesta);
}

input.addEventListener("keydown", e => {
  if (e.key === "Enter") enviar();
});
</script>
</body>
</html>
`, {
      headers: {
        "Content-Type": "text/html",
        ...noCache
      }
    });
  }
};
