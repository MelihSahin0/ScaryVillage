import React, {useEffect, useState} from "react";
import DrawPlayer from "./DrawPlayer";
import {SubscribeReport, SubscribeKill, SubscribePlayerMovement, SubscribeVoting} from "../PlayermanagerSocket";
import { Selection, EffectComposer, Outline } from '@react-three/postprocessing'

export type Player = {
    id: string;
    src: string;
    name: string;
    color: string;
    x: number;
    y: number;
    z: number;
    role: string;
}

type Props = {
    lobbyId: string,
    myPlayerId: string,
    playersOrig: Array<Player>
    setGameState: any
}

export default function PlayerManager({lobbyId, myPlayerId, playersOrig, setGameState}: Props){
    const [players, setPlayers] = useState<Array<Player>>(playersOrig);

    useEffect(() => {

        const updatePlayers = (message: any) => {
            setPlayers(prevPlayers => {
                return prevPlayers.map((player) => {
                    if (player.id === message.id) {
                        console.log(player.role)
                        console.log(player.id)

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

        const report = () => {
            console.log("RETURNED!!!");
            setGameState("voting");
        };
        SubscribeReport(report);

    }, []);

    return (
        <Selection>
            <EffectComposer multisampling={8} autoClear={false}>
                <Outline visibleEdgeColor={"red" as any} edgeStrength={1000} width={1000}/>
            </EffectComposer>
            <DrawPlayer lobbyId={lobbyId} myPlayerId={myPlayerId} players={players} />
        </Selection>
    )
}