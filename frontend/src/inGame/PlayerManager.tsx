import React, {useEffect, useState} from "react";
import DrawPlayer from "./DrawPlayer";
import {
    SubscribeReport,
    Publish,
    SubscribeKill,
    SubscribePlayerMovement,
    SubscribePlayers,
    SubscribeToLobby, CloseConnection, UnsubscribePlayers, UnsubscribePlayerMovement, UnsubscribeKill, UnsubscribeReport
} from "./PlayermanagerSocket";
import {gameState} from "../types";

export type Player = {
    id: string;
    src: string;
    name: string;
    color: string;
    x: number;
    y: number;
    z: number;
    role: string;
    host: boolean;
}

type Props = {
    lobbyId: string,
    myPlayerId: string,
    setGameState(newState: gameState): void;
}

export default function PlayerManager({lobbyId, myPlayerId, setGameState}: Props){

    const [players, setPlayers] = useState<Array<Player>>([]);

    useEffect(() => {
        SubscribeToLobby(lobbyId);
    }, [lobbyId]);

    useEffect(() => {
        const getPlayers = (messages: any) => {
            let foundMyPlayer = false;
            const updatedPlayers: Array<Player> = [];
            messages.forEach((message: any) => {
                const newPlayer: Player = {
                    id: message.id,
                    src: "src/images/pixi.png",
                    name: message.name,
                    color: message.color,
                    x: message.position.x,
                    y: message.position.y,
                    z: 0.5,
                    role: message.role,
                    host: message.host === "true"
                };
                if (message.id === myPlayerId){
                    foundMyPlayer = true;
                }
                updatedPlayers.push(newPlayer);
            });
            if (!foundMyPlayer){
                setGameState("startingScreen");
            }
            setPlayers(updatedPlayers)
        };
        SubscribePlayers(getPlayers)
        return () => {
            UnsubscribePlayers();
        }
    }, [lobbyId, myPlayerId, setGameState]);

    useEffect(() => {
        const updatePlayer = (message: any) => {
            setPlayers(prevPlayers => {
                return prevPlayers.map((player) => {
                    if (player.id === message.id) {
                        if (player.role != "CREWMATEGHOST" && player.role != "IMPOSTERGHOST") {
                            return {
                                ...player,
                                x: message.position.x,
                                y: message.position.y,
                            };
                        } else if (player.id == myPlayerId){
                            return {
                                ...player,
                                x: message.position.x,
                                y: message.position.y,
                            };
                        }
                    }
                    return player;
                });
            });
        };
        SubscribePlayerMovement(updatePlayer);
        return () => {
            UnsubscribePlayerMovement();
        }
    }, [myPlayerId])

    useEffect(() => {
        const kill = (message: any) => {
            setPlayers(prevPlayers => {
                return prevPlayers.map((player) => {
                    if (player.id === message.id) {
                        return {
                            ...player,
                            color: message.color,
                            x: message.position.x,
                            y: message.position.y,
                            role: message.role
                        };
                    }
                    return player;
                });
            });
        };
        SubscribeKill(kill);
        return () => {
            UnsubscribeKill();
        }
    }, []);

    useEffect(() => {
        const report = () => {
            setGameState('voting');
        };
        SubscribeReport(report);
        return () => {
            UnsubscribeReport();
        }
    }, [setGameState]);
    
    useEffect(() => {
        setTimeout(() => {
            const sendMyLobbyId = {
                lobbyId: lobbyId
            };
            Publish("/send/players",  JSON.stringify(sendMyLobbyId));
        }, 400);
        return () => {
            CloseConnection();
        }
    }, [lobbyId]);

    return (
        <>
            <DrawPlayer lobbyId={lobbyId} myPlayerId={myPlayerId} players={players} />
        </>
    )
}