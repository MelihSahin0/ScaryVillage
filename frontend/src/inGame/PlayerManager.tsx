import React, {useEffect, useState} from "react";
import DrawPlayer from "./DrawPlayer";
import {Publish, SubscribeJoinLobby, SubscribeKill, SubscribePlayerMovement} from "./SocketSubscriptions";

export type Player = {
    id: number;
    src: string;
    x: number;
    y: number;
    z: number;
}

let myPlayerId = -1;

export default function (){
    const [players, setPlayers] = useState<Array<Player>>([]);

    useEffect(() => {
        const joinLobby = (message: any) => {
            setPlayers(() => {
                const updatedPlayers = [];

                message.forEach((jsonPlayer: string) => {
                    const player = JSON.parse(jsonPlayer);
                    const newPlayer: Player = {
                        id: player.id,
                        src: 'src/Images/Purple.png',
                        x: player.position.x,
                        y: player.position.y,
                        z: 0.5
                    };

                    updatedPlayers.push(newPlayer);
                });

                if (updatedPlayers.length > 0 && myPlayerId === -1) {
                    myPlayerId = updatedPlayers[updatedPlayers.length - 1].id;
                }

                return [...updatedPlayers];
            });
        };
        SubscribeJoinLobby(joinLobby);

        const updatePlayers = (message: any) => {
            setPlayers(prevPlayers => {


                    return prevPlayers.map((player) => {
                        if (player.id === message.id) {
                            return {
                                ...player,
                                x: message.position.x,
                                y: message.position.y,
                                z: player.z
                            };
                        }
                        return player;
                    });

            });
        };
        SubscribePlayerMovement(updatePlayers);

        const kill = (message: any) => {
            setPlayers(prevPlayers => {


                return prevPlayers.map((player) => {
                    if (player.id === message.id) {
                        return {
                            ...player,
                            x: message.position.x,
                            y: message.position.y,
                            z: player.z
                        };
                    }
                    return player;
                });

            });
        };
        SubscribeKill(kill);

    }, []);

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(() => {
        wait(1000).then(() => {
            Publish("/send/registerPlayer", "");
        });
    }, []);

    return (
        <DrawPlayer myPlayerId={myPlayerId} players={players}/>
    )
}