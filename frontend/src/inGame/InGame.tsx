import {OrthographicCamera} from "@react-three/drei";
import Map from "./Map";
import PlayerManager from "./PlayerManager";
import {gameState} from "../types";
import React from "react";

type Props = {
    lobbyId: string,
    myPlayerId: string,
    setGameState(newState: gameState): void;
}

export default function InGame({lobbyId, myPlayerId, setGameState}: Props){

    return (
        <>
            <OrthographicCamera position={[0, 0, 10]} makeDefault zoom={100}/>
            <ambientLight/>
            <pointLight position={[10, 10, 10]}/>
            <Map/>
            <PlayerManager lobbyId={lobbyId} myPlayerId={myPlayerId} setGameState={setGameState}/>
        </>
    )
}