import React, {useEffect, useState} from "react";
import DrawPlayer from "./DrawPlayer";
import {Publish, SubscribeJoinLobby, SubscribeKill, SubscribePlayerMovement} from "../SocketSubscriptions";
import { Selection, EffectComposer, Outline } from '@react-three/postprocessing'

export type Player = {
    id: number;
    src: string;
    color: string;
    x: number;
    y: number;
    z: number;
    role: string;
}

let myPlayerId = -1;
const colors = [
    'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'cyan', 'magenta',
    'maroon', 'navy', 'olive', 'teal', 'lime', 'aqua', 'fuchsia',
    'brown', 'pink', 'indigo',  'coral',  'violet', 'aquamarine', 'crimson', 'darkred',
    'darkgreen', 'darkblue', 'darkorange', 'darkviolet', 'darkgoldenrod', 'darkcyan',
    'darkmagenta', 'darkkhaki', 'darkslateblue', 'darkolivegreen', 'darkseagreen',
    'lightsalmon', 'lightcoral', 'lightpink', 'lightgreen', 'lightblue', 'lightcyan'
];

export default function (){
    const [players, setPlayers] = useState<Array<Player>>([]);

    useEffect(() => {
        const joinLobby = (messages: any) => {
            setPlayers(() => {
                const updatedPlayers: Array<Player> = [];

                messages.forEach((message: any) => {
                    const newPlayer: Player = {
                        id: message.id,
                        src: 'src/Images/pixi.png',
                        color: colors[message.id],
                        x: message.position.x,
                        y: message.position.y,
                        z: 0.5,
                        role: message.role
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
        SubscribePlayerMovement(updatePlayers);

        const kill = (message: any) => {
            setPlayers(prevPlayers => {
                return prevPlayers.map((player) => {
                    if (player.id === message.id) {
                        return {
                            ...player,
                            color: 'black',
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
    }, []);

    function wait(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(() => {
        wait(1000).then(() => {
            Publish("/send/registerPlayer", "");
        });
    }, []);

    return (
        <Selection>
            <EffectComposer multisampling={8} autoClear={false}>
                <Outline visibleEdgeColor={"red" as any} edgeStrength={1000} width={1000}/>
            </EffectComposer>
            <DrawPlayer myPlayerId={myPlayerId} players={players} />
        </Selection>
    )
}