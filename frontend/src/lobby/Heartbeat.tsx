import {Publish} from "./LobbyManagerSocket";

let sendHeartbeat = false;
let lobbyId = "";
let playerId = "";

let heartbeatTimer: NodeJS.Timeout | null = null;

export function StartHeartbeat(myLobbyId: string, myPlayerId: string) {
    lobbyId = myLobbyId;
    playerId = myPlayerId;
    sendHeartbeat = true;
    Heartbeat();
}

export function StopHeartbeat() {
    sendHeartbeat = false;
    if (heartbeatTimer) {
        clearTimeout(heartbeatTimer);
    }
}

function Heartbeat() {
    const heartbeatData = {
        lobbyId: lobbyId,
        playerId: playerId
    };

    Publish("/send/heartbeat", JSON.stringify(heartbeatData));

    if (sendHeartbeat) {
        heartbeatTimer = setTimeout(Heartbeat, 3000);
    }
}
