import React, {useState} from 'react';
import {useFrame, useThree} from '@react-three/fiber';
import {gameState} from "./types";
import StartingScreen from "./startingScreen/startingScreen";
import InGame from "./inGame/InGame";
import Lobby from "./lobby/lobby";

export default function App() {

    const [gameState, setGameState] = useState<gameState>('startingScreen');

    return (
        <>
            {gameState === 'startingScreen' && <StartingScreen setGameState={setGameState}/>}
            {gameState === 'lobby' && <Lobby setGameState={setGameState}/>}
            {gameState === 'inGame' && <InGame/>}
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