export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const noCache = { "Cache-Control": "no-store" };

    // ================= CHAT IA =================
    if (url.pathname === "/chat") {
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
          headers: { "Content-Type": "application/json", ...noCache }
        });
      }

      return new Response(chatHTML(), {
        headers: { "Content-Type": "text/html", ...noCache }
      });
    }

    // ================= APKs =================
    if (url.pathname === "/apks") {
      return new Response(apkHTML(), {
        headers: { "Content-Type": "text/html", ...noCache }
      });
    }

    // ================= MENÚ =================
    return new Response(menuHTML(), {
      headers: { "Content-Type": "text/html", ...noCache }
    });
  }
};

// ========= MENÚ =========
function menuHTML() {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Chen IA - Menú</title>

<style>
body{
  margin:0;
  font-family:system-ui;
  background:linear-gradient(135deg,#0b141a,#202c33);
  color:#e9edef;
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
}
.menu{
  background:#111b21;
  padding:30px;
  border-radius:16px;
  width:90%;
  max-width:400px;
  text-align:center;
}
a{
  display:block;
  margin:15px 0;
  padding:14px;
  background:#00a884;
  color:#003f2e;
  text-decoration:none;
  border-radius:12px;
  font-weight:bold;
}
a:hover{opacity:.85;}
</style>
</head>
<body>
<div class="menu">
  <h2>👋 Bienvenido</h2>
  <a href="/chat">💬 Chat con Chen IA</a>
  <a href="/apks">🎮 Descargar juegos APK</a>
</div>
</body>
</html>`;
}

// ========= CHAT =========
function chatHTML() {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Chat con Chen IA</title>

<style>
body{
  margin:0;
  font-family:system-ui;
  background:#0b141a;
}
.chat{
  max-width:500px;
  height:100vh;
  margin:auto;
  display:flex;
  flex-direction:column;
}
.header{
  background
