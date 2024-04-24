import React, {useEffect, useState} from "react";
import DrawPlayer from "./DrawPlayer";
import {
    SubscribeReport,
    Publish,
    SubscribeKill,
    SubscribePlayerMovement,
    SubscribePlayers,
    SubscribeToLobby,
    CloseConnection,
    UnsubscribePlayers,
    UnsubscribePlayerMovement,
    UnsubscribeKill,
    UnsubscribeReport,
    SubscribeKillCooldown, UnsubscribeKillCooldown
} from "./PlayermanagerSocket";
import {gameState, role} from "../types";

export type Player = {
    id: string;
    src: string;
    name: string;
    color: string;
    x: number;
    y: number;
    z: number;
    role: role;
    host: boolean;
}

type Props = {
    lobbyId: string,
    myPlayerId: string,
    players: Array<Player>,
    setPlayers: any,
    setGameState(newState: gameState): void;
    setWinner(setWinner: role): void;
    setMyPlayerMap(setMyPlayerMap: Player): void;
}

export default function PlayerManager({lobbyId, myPlayerId, setGameState, setWinner, setMyPlayerMap}: Props){

    const [myPlayer, setMyPlayer] = useState<Player>()
    const [killCooldown, setKillCooldown] = useState(0);
    
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
                    host: message.host === "true",
                };
                if (message.id === myPlayerId){
                    foundMyPlayer = true;
                    setMyPlayer(newPlayer);
                    setMyPlayerMap(newPlayer);
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
    }, []);

    useEffect(() => {
        let myUpdatedPlayer: Player;
        const updatePlayer = (message: any) => {
            setPlayers(prevPlayers => {
                return prevPlayers.map((player) => {
                    if (player.id === myPlayerId){
                        myUpdatedPlayer = player;
                    }
                    if (player.id === message.id) {
                        if (player.role === "deadBody") {
                            return {
                                ...player
                            }
                        }
                        else {
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
            setMyPlayer(myUpdatedPlayer);
            setMyPlayerMap(myUpdatedPlayer);
        };
        SubscribePlayerMovement(updatePlayer);
        return () => {
            UnsubscribePlayerMovement();
        }
    }, [])

    useEffect(() => {
        if (myPlayer?.role === "imposter"){
            const cooldown = (message: any) => {
                setKillCooldown(parseInt(message.killCooldown));
            }
            SubscribeKillCooldown(cooldown);
        }
        return () => {
            UnsubscribeKillCooldown();
        }
    }, [myPlayer?.role]);

    useEffect(() => {
        const kill = (message: any) => {
            let updateMyPlayerMap: Player;
            if (Object.prototype.hasOwnProperty.call(message, "gameFinished") && message.gameFinished === true) {
                setWinner("imposter");
                setGameState("lobby")
            } else {
                let id: string;
                let x: number;
                let y: number;
                //Change Player to ghost
                setPlayers(prevPlayers => {
                    return prevPlayers.map((player) => {
                        if (player.id === message.id) {
                            if (player.id === myPlayerId) {
                                myPlayer!.role = message.role;
                                updateMyPlayerMap = myPlayer!;
                            }
                            id = player.id;
                            x = player.x;
                            y = player.y;
                            return {
                                ...player,
                                color: message.color,
                                y: message.position.y,
                                x: message.position.x,
                                role: message.role
                            };
                        }
                        return player;
                    });
                });
                //Create a dead Body
                setPlayers(prevPlayers => [
                    ...prevPlayers,
                    {
                        id: id + "@",
                        src: "src/images/pixi.png",
                        name: message.name,
                        color: "black",
                        x: x,
                        y: y,
                        z: 0.5,
                        role: "deadBody",
                        host: false,
                    }
                ]);
            }
            setMyPlayerMap(updateMyPlayerMap!);
        };
        SubscribeKill(kill);
        return () => {
            UnsubscribeKill();
        }
    }, [myPlayer?.role, setWinner]);

    useEffect(() => {
        const report = () => {
            setGameState('voting');
        };
        SubscribeReport(report);
        return () => {
            UnsubscribeReport();
        }
    }, []);
    
    useEffect(() => {
        setTimeout(() => {
            const sendMyLobbyId = {
                lobbyId: lobbyId
            };
            Publish("/send/players",  JSON.stringify(sendMyLobbyId));
        }, 500);
        return () => {
            CloseConnection();
        }
    }, []);

    return (
        <>
            <DrawPlayer lobbyId={lobbyId} myPlayer={myPlayer} players={players} killCooldown={killCooldown} />
        </>
    )
}