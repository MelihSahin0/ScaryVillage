import {Canvas} from "@react-three/fiber";
import {OrthographicCamera} from "@react-three/drei";
import Map from "./Map";
import PlayerManager, {Player} from "./PlayerManager";
import {gameState} from "../types";
import React, {useState} from "react";
import Voting from "../voting/Voting";


type Props = {
    lobbyId: string,
    myPlayerId: string,
    setGameState(newState: gameState): void;
    playersOrig: Array<Player>
    players: any;
    setPlayers: any
}

export default function InGame({lobbyId, myPlayerId, setGameState}: Props){
    const [voting, setVoting] = useState<boolean>(false); // Example values

    return (
        <div id="canvas-container">
            {voting && <Voting myPlayerId={myPlayerId} players={players} lobbyId={lobbyId} setGameState={setGameState} setVoting={setVoting} setPlayers={setPlayers}/>}
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