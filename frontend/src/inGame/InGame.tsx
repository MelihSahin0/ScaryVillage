import {Canvas} from "@react-three/fiber";
import {OrthographicCamera} from "@react-three/drei";
import Map from "./Map";
import PlayerManager from "./PlayerManager";
import React from "react";
import {gameState} from "../types";

type Props = {
    lobbyId: string,
    myPlayerId: string,
    setGameState(newState: gameState): void;
}

export default function InGame({lobbyId, myPlayerId, setGameState}: Props){

    return (
        <div id="canvas-container">
            <Canvas style={{height: '100vh'}}>
                <OrthographicCamera position={[0, 0, 10]} makeDefault zoom={100}/>
                <ambientLight/>
                <pointLight position={[10, 10, 10]}/>
                <Map/>
                <PlayerManager lobbyId={lobbyId} myPlayerId={myPlayerId}/>
            </Canvas>
        </div>
    )
}