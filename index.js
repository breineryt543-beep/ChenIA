export default {
  async fetch(request, env) {

    if (request.method === "POST") {
      const { message } = await request.json();

      const aiResponse = await env.AI.run(
        "@cf/meta/llama-3-8b-instruct",
        {
          messages: [
            { role: "system", content: "Eres ChenIA, un asistente amable que habla español." },
            { role: "user", content: message }
          ]
        }
      );

      return new Response(
        JSON.stringify({ reply: aiResponse.response }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>ChenIA</title>
  <style>
    body { font-family: Arial; background:#111; color:#fff; }
    #chat { max-width:600px; margin:auto; }
    input, button { padding:10px; margin-top:5px; }
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
