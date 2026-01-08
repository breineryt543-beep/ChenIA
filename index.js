export default {
  async fetch(request, env) {
    if (request.method === "POST") {
      const { mensaje } = await request.json();

      const respuesta = "Recibí tu mensaje: " + mensaje;

      return new Response(JSON.stringify({ respuesta }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Chen IA</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #111;
      color: #fff;
    }
    .chat {
      max-width: 500px;
      margin: 40px auto;
    }
    input, button {
      padding: 10px;
      width: 100%;
      margin-top: 5px;
      border: none;
      border-radius: 4px;
    }
    button {
      background: #00ffcc;
      cursor: pointer;
    }
    #log {
      background: #222;
      padding: 10px;
      min-height: 200px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="chat">
    <h2>🤖 Chen IA</h2>
    <div id="log"></div>
    <input id="msg" placeholder="Escribe algo..." />
    <button onclick="enviar()">Enviar</button>
  </div>

  <script>
    async function enviar() {
      const input = document.getElementById("msg");
      const log = document.getElementById("log");

      const texto = input.value;
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
    }
  </script>
</body>
</html>
    `, {
      headers: { "Content-Type": "text/html" }
    });
  }
};
