import {gameState} from "../types";
import React, {useEffect, useState} from "react";
import {Publish, SubscribeJoinLobby, SubscribeLobbyStatus, SubscribeToLobby} from "./LobbyManagerSocket";
import {Unsubscribe as GameUnsubscribe} from "../startingScreen/GameManagerSocket";
import PlayerList from "./PlayerList";
import PlayerSettings from "./PlayerSettings";
import LobbyInfo from "./LobbyInfo";
import LobbySettings from "./LobbySettings";
import {startHeartbeat} from "./Heartbeat";

type Props = {
    myPlayerId: string
    lobbyId: string,
    setGameState(newState: gameState): void;
};

export type Player = {
    id: string;
    name: string;
    color: string;
    role: string;
    host: boolean;
}

export default function Lobby({myPlayerId, lobbyId, setGameState}: Props){

    GameUnsubscribe();

    const [displayPlayers, setDisplayPlayers] = useState<Array<Player>>([]);
    const [myPlayer, setMyPlayer] = useState<Player | undefined>();

    useEffect(() => {
        SubscribeToLobby(lobbyId);
    }, [lobbyId]);

    useEffect(() => {
        const joinLobby = (messages: any) => {
            let foundMyPlayer = false;
            const updatedPlayers: Array<Player> = [];
            messages.forEach((message: any) => {
                const newPlayer: Player = {
                    id: message.id,
                    name: message.name,
                    color: message.color,
                    role: message.role,
                    host: message.host === "true"
                };
                updatedPlayers.push(newPlayer);

                if (newPlayer.id === myPlayerId){
                    setMyPlayer(newPlayer)
                    foundMyPlayer = true;
                }
            });
            if (!foundMyPlayer){
                setGameState("startingScreen");
            }
            setDisplayPlayers(updatedPlayers)
        };
        SubscribeJoinLobby(joinLobby);

        const lobbyStatus = (message: any) => {
            if (message.gameStatus === "INGAME") {
                setGameState('inGame');
            }
        };
        SubscribeLobbyStatus(lobbyStatus);
    }, [lobbyId, myPlayerId]);

    useEffect(() => {
        setTimeout(() => {
            const sendMyPlayerId = {
                playerId: myPlayerId,
                lobbyId: lobbyId
            };
            Publish("/send/registerPlayer", JSON.stringify(sendMyPlayerId));
            startHeartbeat(lobbyId, myPlayerId);
        }, 400);
    }, [lobbyId, myPlayerId]);

    return (
        <div className="bg-gray-700 w-screen h-screen" >
            <div className="grid grid-cols-2 gap-4 pt-24 pb-40 justify-items-center">
                <div className="col-span-1 grid-cols-subgrid w-80 min-h-80 justify-center items-center">
                    <PlayerList displayPlayers={displayPlayers}/>
                </div>
                <div className="col-span-1 grid-cols-subgrid w-80 min-h-82 justify-center items-center flex">
                    <div className="border-white border-2 min-h-80 flex-1">
                        <PlayerSettings myPlayer={myPlayer} lobbyId={lobbyId}/>
                        {myPlayer?.host && <LobbySettings lobbyId={lobbyId} maxNumberOfPlayers={displayPlayers.length}/>}
                    </div>
                </div>
            </div>
            <LobbyInfo myPlayer={myPlayer} lobbyId={lobbyId} onClickStart={() => {
                const gameStatus = {
                    lobbyId: lobbyId,
                    gameStatus: "INGAME"
                };
                Publish("/send/setLobbyStatus", JSON.stringify(gameStatus));
                }} onClickLeave={() => {
                const leaveGame= {
                    lobbyId: lobbyId,
                    playerId: myPlayerId
                };
                Publish("/send/removePlayer", JSON.stringify(leaveGame));
            }}/>
        </div>
    );
}