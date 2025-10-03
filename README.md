Bloom-OS Base

Servidor + Socket para RPG Maker MV

Este projeto é uma base oficial e aberta do Bloom-OS para quem deseja criar jogos online multiplayer no RPG Maker MV.
Ele contém:

🖥 Servidor Node.js + WebSocket (com SQLite e bcrypt para login/registro seguros)

🎮 Plugin Cliente (BloomSocket) para RPG Maker MV, que conecta no servidor

📦 Estrutura simples e comentada para que qualquer desenvolvedor possa expandir

🚀 Instalação do Servidor
1. Pré-requisitos

Node.js instalado (versão 22+)

NPM (vem junto com Node.js)

2. Instalar dependências

Na pasta do servidor, rode:

npm install ws sqlite3 bcrypt

3. Iniciar servidor
node server.js
Faça um arquivo .bat para facilitar a rodar o servidor de modo mais prático
''@echo off
title Bloom-OS Server
node server.js
pause''
tire os '' do código e faça um arquivo.bat com esse código.



Se tudo estiver certo, aparecerá:

Bloom-OS Server rodando na porta 5000
