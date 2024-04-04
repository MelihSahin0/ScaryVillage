import React, {useState} from 'react';
import {useFrame, useThree} from '@react-three/fiber';
import {gameState} from "./types";
import StartingScreen from "./startingScreen/StartingScreen";
import InGame from "./inGame/InGame";
import Lobby from "./lobby/Lobby";
import {Player} from "./inGame/PlayerManager";

export default function App() {

    const [gameState, setGameState] = useState<gameState>('startingScreen');
    const [myPlayerId, setMyPlayerId] = useState("");
    const [lobbyId, setLobbyId] = useState("");
    const [players, setPlayers] = useState<Array<Player>>([]);

    return (
        <>
            {gameState === 'startingScreen' && <StartingScreen setMyPlayerId={setMyPlayerId} setLobbyId={setLobbyId} setGameState={setGameState}/>}
            {gameState === 'lobby' && <Lobby setPlayers={setPlayers} myPlayerId={myPlayerId} lobbyId={lobbyId} setGameState={setGameState}/>}
            {gameState === 'inGame' && <InGame lobbyId={lobbyId} myPlayerId={myPlayerId} playersOrig={players}/>}
        </>
    );
}

//TODO
function CameraMovement() {
    const {camera} = useThree();

    React.useLayoutEffect(() => {
        camera.rotation.order = 'YXZ'
        camera.rotation.y = -Math.PI / 4
        camera.rotation.x = Math.atan(-1 / Math.sqrt(2))
        camera.translateZ(100)
    }, [camera]);

    // Move the camera
    useFrame(() => {
        if (camera && camera.position) { // Ensure camera and camera.position are not null
            camera.position.x += 0;
        }
    });

    return null;
}