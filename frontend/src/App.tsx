import React, {useState} from 'react';
import {Canvas, useFrame, useThree} from '@react-three/fiber';
import {OrthographicCamera} from "@react-three/drei";
import Map from "./inGame/Map";
import PlayerManager from "./inGame/PlayerManager";
import {gameState} from "./types";

export default function App() {

    const [gameState, setGameState] = useState<gameState>('startingScreen');

    return (
      <div id="canvas-container">
          <Canvas style={{height: '97vh'}}>
              <OrthographicCamera position={[0, 0, 10]} makeDefault zoom={100}/>
              <ambientLight/>
              <pointLight position={[10, 10, 10]}/>
              <Map/>
              <PlayerManager/>
          </Canvas>
      </div>
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