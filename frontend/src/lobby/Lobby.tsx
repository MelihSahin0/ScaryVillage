import {gameState, role} from "../types";
import React, {useEffect, useRef, useState} from "react";
import {
    Publish, SubscribeGetMessages,
    SubscribeJoinLobby,
    SubscribeLobbyStatus,
    SubscribeToLobby, UnsubscribeGetMessages,
    UnsubscribeJoinLobby, UnsubscribeLobbyStatus
} from "./LobbyManagerSocket";
import PlayerList from "./PlayerList";
import PlayerSettings from "./PlayerSettings";
import LobbyInfo from "./LobbyInfo";
import LobbySettings from "./LobbySettings";
import {StartHeartbeat} from "./Heartbeat";
import {CloseConnection as ClosePlayermanagerConnection} from "../inGame/PlayermanagerSocket";
import {CloseConnection as CloseTaskmanagerConnection} from "../inGame/TaskmanagerSocket";
import TextChat from "./TextChat";

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

export type Message = {
    wasAlive: string;
    playerName: string;
    message: string;
}

export default function Lobby({myPlayerId, lobbyId, setGameState, setWinner, winner}: Props){
    const [displayPlayers, setDisplayPlayers] = useState<Array<Player>>([]);
    const [myPlayer, setMyPlayer] = useState<Player | undefined>();
    const [messages, setMessages] = useState<Array<Message>>([])
    const audioRef = useRef<HTMLAudioElement>(null);
    
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
        const getMessages = (messages: any) => {
            setMessages(messages)
        }
        SubscribeGetMessages(getMessages);

        return () => {
            UnsubscribeGetMessages();
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            const sendMyPlayerId = {
                playerId: myPlayerId,
                lobbyId: lobbyId
            };
            Publish("/send/registerPlayer", JSON.stringify(sendMyPlayerId));
            const getMessages = {
                lobbyId: lobbyId
            }
            Publish("/send/getMessages", JSON.stringify(getMessages));
            StartHeartbeat(lobbyId, myPlayerId);
        }, 500);
    }, [lobbyId, myPlayerId]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.03;
            audioRef.current.loop = true;
            audioRef.current.play();
        }
    }, []);

    return (
        <div className="bg-gray-700 w-screen h-screen" >
            <audio ref={audioRef}>
                <source src="/sounds/mysterious.mp3" type="audio/mpeg" />
            </audio>
            <div className="flex justify-items-center justify-center pt-10">
                {winner !== undefined && <h1 className="text-white text-2xl">The winner of the previous round: {winner.toUpperCase()}</h1>}
            </div>
            <div className="grid grid-cols-3 pt-5 justify-items-center">
                <div className="col-span-1 grid-cols-subgrid w-80 justify-center items-center ml-32">
                    <PlayerList displayPlayers={displayPlayers}/>
                </div>
                <div className="col-span-1 grid-cols-subgrid w-80 justify-center items-center">
                    <TextChat lobbyId={lobbyId} myPlayerId={myPlayerId} messages={messages} players={displayPlayers}/>
                </div>
                <div className="col-span-1 grid-cols-subgrid w-80 justify-center items-center mr-32">
                    <div className="border-white border-2 min-h-80">
                        <PlayerSettings myPlayer={myPlayer} lobbyId={lobbyId}/>
                        {myPlayer?.host &&
                            <LobbySettings lobbyId={lobbyId} maxNumberOfPlayers={displayPlayers.length}/>}
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