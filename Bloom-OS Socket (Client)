/*:
 * @plugindesc Bloom-OS Socket Base - Conexão com servidor Node.js
 * @author Merim
 */

(function(){
"use strict";

window.BloomSocket = {
    _ws: null,
    _connected: false,
    _url: "ws://localhost:5000", // ajuste se necessário
    _onStatusChange: null,
    _onStartGame: null,
    _onCharactersUpdated: null,

    connect() {
        if(this._ws && (this._ws.readyState===WebSocket.OPEN || this._ws.readyState===WebSocket.CONNECTING)) return;
        console.log("[BloomSocket] Conectando...");
        this._ws = new WebSocket(this._url);

        this._ws.onopen = ()=>{
            this._connected = true;
            console.log("[BloomSocket] Conectado!");
            if(this._onStatusChange) this._onStatusChange(true);
        };

        this._ws.onmessage = (evt)=>{
            try{
                const data = JSON.parse(evt.data);
                this.handle(data);
            }catch(e){ console.error("[BloomSocket] JSON inválido",e);}
        };

        this._ws.onclose = ()=>{
            this._connected=false;
            console.warn("[BloomSocket] Desconectado, tentando reconectar...");
            if(this._onStatusChange) this._onStatusChange(false);
            setTimeout(()=>this.connect(),5000);
        };

        this._ws.onerror = (err)=>console.error("[BloomSocket] Erro:",err);
    },

    send(obj){
        if(this._connected && this._ws.readyState===WebSocket.OPEN)
            this._ws.send(JSON.stringify(obj));
        else
            console.warn("[BloomSocket] Tentativa sem conexão", obj);
    },

    isConnected(){ return this._connected && this._ws && this._ws.readyState===WebSocket.OPEN; },

    // ================= HANDLE =================
    handle(data){
        switch(data.type){
            case "login_success":
                window.BloomCharactersData = data.characters || [];
                if(typeof Scene_BloomCreateSelect !== "undefined")
                    SceneManager.goto(Scene_BloomCreateSelect);
                break;
            case "login_fail": console.warn("[BloomSocket] Falha login:", data.reason); break;
            case "register_success": console.log("[BloomSocket] Registro OK"); break;
            case "register_fail": console.warn("[BloomSocket] Falha registro:", data.reason); break;
            case "characters_updated":
            case "create_character_success":
            case "delete_character_success":
                if(data.characters){
                    window.BloomCharactersData = data.characters;
                    if(this._onCharactersUpdated) this._onCharactersUpdated(data.characters);
                    if(typeof Scene_BloomCreateSelect !== "undefined" && SceneManager._scene instanceof Scene_BloomCreateSelect)
                        SceneManager._scene.refreshCharacterList();
                }
                break;
            case "start_game":
                if(data.character) this._handleStartGame(data.character, data.playersInMap);
                break;
            default: console.log("[BloomSocket] Mensagem não tratada:", data); break;
        }
    },

    // ================= START GAME =================
    _handleStartGame(character, playersInMap){
        if(!character) return;
        window.BloomStartCharacter = character;
        $gameParty._actors = [];
        $gameActors._data = [];

        const actorInstance = new Game_Actor(character.actor_id);
        actorInstance.setup(character.actor_id);
        actorInstance.setName(character.name);
        actorInstance.changeLevel(character.level || 1, false);
        $gameParty._gold = character.gold || 0;

        actorInstance._bag = [];
        actorInstance._bagSize = 27;
        actorInstance.equipment = {};

        if(Array.isArray(character.inventory)){
            character.inventory.forEach(item=>{
                if(item && $dataItems[item.id]) actorInstance._bag.push($dataItems[item.id]);
            });
        }

        if(character.equipment){
            Object.keys(character.equipment).forEach(slotId=>{
                const eqData = character.equipment[slotId];
                if(!eqData) return;
                const eqItem = $dataArmors[eqData.id] || $dataWeapons[eqData.id];
                if(eqItem) actorInstance.equipment[slotId] = eqItem;
            });
        }

        actorInstance.setHp(character.hp != null ? character.hp : actorInstance.mhp);
        actorInstance.setMp(character.mp != null ? character.mp : actorInstance.mmp);

        $gameActors._data[character.actor_id] = actorInstance;
        $gameParty.addActor(character.actor_id);

        if(character.mapId != null && character.x != null && character.y != null)
            $gamePlayer.reserveTransfer(character.mapId, character.x, character.y, character.direction || 2, 0);

        $gameTemp._inGame = true;

        if(this._onStartGame) this._onStartGame(character);
    }
};

// ================= AUTO-CONNECT =================
if(typeof Scene_Boot !== "undefined"){
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function(){
        _Scene_Boot_start.call(this);
        BloomSocket.connect();
    };
}

})();
