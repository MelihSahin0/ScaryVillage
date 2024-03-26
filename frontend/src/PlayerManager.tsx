import React, {useEffect, useState} from "react";
import DrawPlayer from "./DrawPlayer";
import SocketSubscriptions from "./SocketSubscriptions";
import {GetPlayerId} from "./SocketSubscriptions";

export type Player = {
    id: number;
    src: string;
    x: number;
    y: number;
    z: number;
}

export default function (){
    const [players, setPlayers] = useState<Array<Player>>([]);

    useEffect(() => {
        const getNewPlayer = (messages: any) => {
            const newPlayer: Player = {
                id: messages,
                src: 'src/Images/Purple.png',
                x: 0,
                y: 0,
                z: 0.5
            };
            setPlayers([...players, newPlayer]);
        };
        GetPlayerId(getNewPlayer);
    }, []);

    useEffect(() => {
        const updatePlayers = (message: any) => {
            setPlayers(prevPlayers => {

                const existingPlayerIndex = prevPlayers.findIndex(player => player.id === message.id);

                if (existingPlayerIndex !== -1) {
                    return prevPlayers.map((player, index) => {
                        if (index === existingPlayerIndex) {
                            return {
                                ...player,
                                x: message.position.x,
                                y: message.position.y,
                                z: player.z
                            };
                        }
                        return player;
                    });
                } else {
                    const newPlayer = {
                        id: message.id,
                        src: 'src/Images/Purple.png',
                        x: message.position.x,
                        y: message.position.y,
                        z: 0.5
                    };
                    return [...prevPlayers, newPlayer];
                }
            });
        };
        SocketSubscriptions(updatePlayers);
    }, []);

    return (
        <DrawPlayer players={players}/>
    )
}