import React, {useEffect, useState} from 'react';
import {Canvas, useFrame, useThree} from '@react-three/fiber';
import {OrthographicCamera} from "@react-three/drei";
import Map from "./Map";
import DrawPlayer from "./DrawPlayer";

export type Player = {
    id: number;
    src: string;
    x: number;
    y: number;
    z: number;
}

export default function App() {

    const [players, setPlayers] = useState<Array<Player>>([]);

    const newPlayer: Player = {
        id: 0,
        src: 'src/Images/Purple.jpg',
        x: 0,
        y: 0,
        z: 0
    }

    //GANZ WICHTIG
    useEffect(() => {
        // Add a new player when the component mounts
        const newPlayer: Player = {
            id: 0,
            src: 'src/Images/Purple.jpg',
            x: 0,
            y: 0,
            z: 0
        };

        setPlayers([...players, newPlayer]);
    }, []);

    return (
      <div id="canvas-container">
          <Canvas style={{height: '97vh'}}>
              <OrthographicCamera position={[0, 0, 10]} makeDefault zoom={30}/>
              <ambientLight/>
              <pointLight position={[10, 10, 10]}/>
              <Map/>
              <DrawPlayer myPlayer={players.at(0)} players={players}/>
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