import {OrthographicCamera} from "@react-three/drei";
import Map from "./Map";
import PlayerManager, {Player} from "./PlayerManager";
import {gameState, role} from "../types";
import React, {useState} from "react";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    setGameState(newState: gameState): void;
    setWinner(setWinner: role): void;
}

export default function InGame({lobbyId, myPlayerId, setGameState, setWinner}: Props){

    const [myPlayer, setMyPlayer] = useState<Player>();

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
            <OrthographicCamera position={[0, 0, 10]} makeDefault zoom={100}/>
            <ambientLight/>
            <pointLight position={[10, 10, 10]}/>
            <Map lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer}/>
            <PlayerManager lobbyId={lobbyId} myPlayerId={myPlayerId} setGameState={setGameState} setWinner={setWinner} setMyPlayerMap={setMyPlayer}/>
        </>
    )
}