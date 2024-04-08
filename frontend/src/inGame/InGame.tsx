import {Canvas} from "@react-three/fiber";
import {OrthographicCamera} from "@react-three/drei";
import Map from "./Map";
import PlayerManager, {Player} from "./PlayerManager";
import React from "react";

type Props = {
    lobbyId: string,
    myPlayerId: string,
    playersOrig: Array<Player>
    setGameState: any
}

export default function InGame({lobbyId, myPlayerId, playersOrig, setGameState}: Props){
    return (
        <div id="canvas-container">
            <Canvas style={{height: '100vh'}}>
                <OrthographicCamera position={[0, 0, 10]} makeDefault zoom={100}/>
                <ambientLight/>
                <pointLight position={[10, 10, 10]}/>
                <Map/>
                <PlayerManager lobbyId={lobbyId} myPlayerId={myPlayerId} playersOrig={playersOrig} setGameState={setGameState}/>
            </Canvas>
        </div>
    )
}