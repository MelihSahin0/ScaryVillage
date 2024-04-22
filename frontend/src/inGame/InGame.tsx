import {OrthographicCamera} from "@react-three/drei";
import Map from "./Map";
import PlayerManager, {Player} from "./PlayerManager";
import {gameState} from "../types";
import React, {useState} from "react";
import {Simulate} from "react-dom/test-utils";
import play = Simulate.play;

type Props = {
    lobbyId: string;
    myPlayerId: string;
    setGameState(newState: gameState): void;
}

export default function InGame({lobbyId, myPlayerId, setGameState}: Props){

    const [players, setPlayers] = useState<Array<Player>>([]);

    let myPlayerX: number = 0;
    let myPlayerY: number = 0;

    for (let i = 0; i < players.length; i++) {
        if (players[i].id === myPlayerId) {
            myPlayerX = players[i].x;
            myPlayerY = players[i].y;
        }
    }

    return (
        <>
            <OrthographicCamera position={[myPlayerX, myPlayerY, 10]} makeDefault zoom={500}/>
            <ambientLight/>
            <pointLight position={[10, 10, 10]}/>
            <Map lobbyId={lobbyId} myPlayerId={myPlayerId}/>
            <PlayerManager lobbyId={lobbyId} myPlayerId={myPlayerId} players={players} setPlayers={setPlayers} setGameState={setGameState}/>
        </>
    )
}