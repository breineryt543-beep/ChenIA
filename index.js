export default {
  async fetch(request) {
    if (request.method === "POST") {
      const data = await request.json();
      return new Response(
        JSON.stringify({ reply: "Recibí tu mensaje: " + data.message }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(`
<!DOCTYPE html>
<html>
<head>
  <title>ChenIA Chat</title>
  <style>
    body { font-family: Arial; background:#111; color:#fff; }
    #chat { max-width:600px; margin:auto; }
    input, button { padding:10px; }
  </style>
</head>
<body>
  <div id="chat">
    <h2>ChenIA 🤖</h2>
    <div id="messages"></div>
    <input id="msg" placeholder="Escribe algo..." />
    <button onclick="send()">Enviar</button>
  </div>

  <script>
    async function send() {
      const input = document.getElementById("msg");
      const res = await fetch("/", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ message: input.value })
      });
      const data = await res.json();
      document.getElementById("messages").innerHTML += 
        "<p><b>Tú:</b> " + input.value + "</p>" +
        "<p><b>ChenIA:</b> " + data.reply + "</p>";
      input.value = "";
    }
  </script>
</body>
</html>
    `, { headers: { "Content-Type": "text/html" } });
  }
}
