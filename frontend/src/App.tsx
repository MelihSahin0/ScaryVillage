import React, {useState} from 'react';
import {Canvas, useFrame, useThree} from '@react-three/fiber';
import {gameState} from "./types";
import StartingScreen from "./startingScreen/StartingScreen";
import InGame from "./inGame/InGame";
import Lobby from "./lobby/Lobby";
import {v4 as uuidv4} from "uuid";
import Voting from "./voting/Voting";

export default function App() {

    const [gameState, setGameState] = useState<gameState>('startingScreen');
    const [myPlayerId] = useState(uuidv4().toString().replaceAll("-",""));
    const [lobbyId, setLobbyId] = useState("");

    return (
        <>
            {gameState === 'startingScreen' && <StartingScreen myPlayerId={myPlayerId} setLobbyId={setLobbyId} setGameState={setGameState}/>}
            {gameState === 'lobby' && <Lobby myPlayerId={myPlayerId} lobbyId={lobbyId} setGameState={setGameState}/>}
            <Canvas style={{height: '100vh', display: gameState === 'inGame' ? 'block' : 'none'}}>
                {gameState === 'inGame' && <InGame lobbyId={lobbyId} myPlayerId={myPlayerId} setGameState={setGameState}/>}
            </Canvas>
            {gameState === 'voting' && <Voting lobbyId={lobbyId} myPlayerId={myPlayerId} setGameState={setGameState}/>}
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