import {gameState, role} from "../types";
import React, {useEffect, useState} from "react";
import {
    Publish,
    SubscribeJoinLobby,
    SubscribeLobbyStatus,
    SubscribeToLobby,
    UnsubscribeJoinLobby, UnsubscribeLobbyStatus
} from "./LobbyManagerSocket";
import PlayerList from "./PlayerList";
import PlayerSettings from "./PlayerSettings";
import LobbyInfo from "./LobbyInfo";
import LobbySettings from "./LobbySettings";
import {StartHeartbeat} from "./Heartbeat";
import {CloseConnection as ClosePlayermanagerConnection} from "../inGame/PlayermanagerSocket";
import {CloseConnection as CloseTaskmanagerConnection} from "../inGame/TaskmanagerSocket";

type Props = {
    myPlayerId: string;
    lobbyId: string;
    setGameState(newState: gameState): void;
    setWinner(winner: role | undefined): void;
    winner: role | undefined;
};

export type Player = {
    id: string;
    name: string;
    color: string;
    role: role;
    host: boolean;
}

export default function Lobby({myPlayerId, lobbyId, setGameState, setWinner, winner}: Props){
    const [displayPlayers, setDisplayPlayers] = useState<Array<Player>>([]);
    const [myPlayer, setMyPlayer] = useState<Player | undefined>();

    ClosePlayermanagerConnection();
    CloseTaskmanagerConnection();

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
        return () => {
            UnsubscribeJoinLobby();
        }
    }, [lobbyId, myPlayerId, setGameState]);

    useEffect(() => {
        const lobbyStatus = (message: any) => {
            if (message.gameStatus === "inGame") {
                setGameState('inGame');
            }
        };
        SubscribeLobbyStatus(lobbyStatus);
        return () => {
            UnsubscribeLobbyStatus();
        }
    }, [setGameState]);

    useEffect(() => {
        setTimeout(() => {
            const sendMyPlayerId = {
                playerId: myPlayerId,
                lobbyId: lobbyId
            };
            Publish("/send/registerPlayer", JSON.stringify(sendMyPlayerId));
            StartHeartbeat(lobbyId, myPlayerId);
        }, 500);
    }, [lobbyId, myPlayerId]);

    return (
        <div className="bg-gray-700" >
            <div className="flex justify-items-center justify-center pt-10">
                {winner !== undefined && <h1 className="text-white text-2xl">The winner of the previous round: {winner.toUpperCase()}</h1>}
            </div>
            <div className="grid grid-cols-2 gap-4 pt-14 pb-40 justify-items-center">
                <div className="col-span-1 grid-cols-subgrid w-80 min-h-80 justify-center items-center">
                    <PlayerList displayPlayers={displayPlayers}/>
                </div>
                <div className="col-span-1 grid-cols-subgrid w-80 min-h-82 justify-center items-center">
                    <div className="border-white border-2 min-h-80">
                        <PlayerSettings myPlayer={myPlayer} lobbyId={lobbyId}/>
                        {myPlayer?.host && <LobbySettings lobbyId={lobbyId} maxNumberOfPlayers={displayPlayers.length}/>}
                    </div>
                </div>
            </div>
            <LobbyInfo myPlayer={myPlayer} lobbyId={lobbyId} players={displayPlayers} onClickStart={() => {

                const gameStatus = {
                    lobbyId: lobbyId,
                    gameStatus: "inGame"
                };
                Publish("/send/setLobbyStatus", JSON.stringify(gameStatus));
                }} onClickLeave={() => {
                const leaveGame= {
                    lobbyId: lobbyId,
                    playerId: myPlayerId
                };
                Publish("/send/removePlayer", JSON.stringify(leaveGame));
                setWinner(undefined);
            }}/>
        </div>
    );
}