export default {
  async fetch(request, env) {

    // Cuando el navegador envía un mensaje
    if (request.method === "POST") {
      const { message } = await request.json();

      const aiResponse = await env.AI.run(
        "@cf/meta/llama-3-8b-instruct",
        {
          messages: [
            { role: "system", content: "Eres una IA amable que responde en español." },
            { role: "user", content: message }
          ]
        }
      );

      return new Response(
        JSON.stringify({ reply: aiResponse.response }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Página web (HTML + CSS + JS)
    return new Response(`
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Mi IA</title>
<style>
body { font-family: Arial; background:#111; color:#fff; text-align:center; }
#chat { max-width:600px; margin:auto; }
#messages { height:300px; overflow:auto; border:1px solid #444; padding:10px; }
input, button { padding:10px; margin-top:5px; }
</style>
</head>
<body>
<h1>Bienvenido a mi IA</h1>
<div id="chat">
  <div id="messages"></div>
  <input id="msg" placeholder="Escribe tu mensaje..." />
  <button onclick="send()">Enviar</button>
</div>

<script>
async function send() {
  const input = document.getElementById("msg");
  const messages = document.getElementById("messages");
  const text = input.value;
  if (!text) return;

  messages.innerHTML += "<p><b>Tú:</b> " + text + "</p>";
  input.value = "";

  const res = await fetch("/", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();
  messages.innerHTML += "<p><b>IA:</b> " + data.reply + "</p>";
}
</script>
</body>
</html>
    `, {
      headers: { "Content-Type": "text/html" }
    });
  }
}
