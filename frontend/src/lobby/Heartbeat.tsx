import {Publish} from "./LobbyManagerSocket";

let sendHeartbeat = false;
let lobbyId = "";
let playerId = "";

let heartbeatTimer: NodeJS.Timeout | null = null;

export function startHeartbeat(myLobbyId: string, myPlayerId: string) {
    lobbyId = myLobbyId;
    playerId = myPlayerId;
    sendHeartbeat = true;
    heartbeat();
}

export function stopHeartbeat() {
    sendHeartbeat = false;
    if (heartbeatTimer) {
        clearTimeout(heartbeatTimer);
    }
}

function heartbeat() {
    const heartbeatData = {
        lobbyId: lobbyId,
        playerId: playerId
    };

    Publish("/send/heartbeat", JSON.stringify(heartbeatData));

    if (sendHeartbeat) {
        heartbeatTimer = setTimeout(heartbeat, 3000);
    }
}
