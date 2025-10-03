// server.js - Bloom-OS Base
// Requisitos: use o cmd para instalar o seguinte comando >> npm install ws sqlite3 bcrypt
// Autor: Merim @AetherMakers  https://aethermakers.forumeiros.com/

// server.js
const WebSocket = require("ws");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

// Banco de dados   
const db = new sqlite3.Database("./bloom.db");

// Cria tabela de contas básica <<< aqui é a sessão de tabelas 
db.run(`CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

// Servidor WebSocket na porta 5000
const wss = new WebSocket.Server({ port: 5000 }, () => {
  console.log("Bloom-OS Server rodando na porta 5000");
});

wss.on("connection", (ws) => {
  console.log("Novo cliente conectado!");

  ws.on("message", async (msg) => {
    try {
      const data = JSON.parse(msg);

      // Registro de usuário com bcrypt
      if (data.type === "register") {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        db.run(
          "INSERT INTO accounts (username, password) VALUES (?, ?)",
          [data.username, hashedPassword],
          function (err) {
            if (err) {
              ws.send(JSON.stringify({ type: "register", success: false, error: "Usuário já existe" }));
            } else {
              ws.send(JSON.stringify({ type: "register", success: true }));
            }
          }
        );
      }

      // Login com comparação bcrypt
      if (data.type === "login") {
        db.get(
          "SELECT * FROM accounts WHERE username = ?",
          [data.username],
          async (err, row) => {
            if (!row) {
              ws.send(JSON.stringify({ type: "login", success: false, error: "Usuário não encontrado" }));
              return;
            }

            const match = await bcrypt.compare(data.password, row.password);
            if (match) {
              ws.send(JSON.stringify({ type: "login", success: true, userId: row.id }));
            } else {
              ws.send(JSON.stringify({ type: "login", success: false, error: "Senha incorreta" }));
            }
          }
        );
      }

    } catch (e) {
      console.error("Erro ao processar mensagem:", e);
    }
  });

  ws.on("close", () => {
    console.log("Cliente desconectado.");
  });
});
