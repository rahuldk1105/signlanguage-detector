import express from "express";
import { WebSocketServer } from "ws";
import http from "http";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static("public"));

let latestSignal = "";

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ signal: latestSignal }));
});

app.get("/send/:letter", (req, res) => {
  latestSignal = req.params.letter;
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ signal: latestSignal }));
    }
  });
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
