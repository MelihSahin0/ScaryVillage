import {gameState} from "../types";
import {Canvas} from "@react-three/fiber";
import {OrthographicCamera} from "@react-three/drei";
import React from "react";
import Map from "./Map"

type Props = {
    setGameState(newState: gameState): void;
};

export default function Lobby({setGameState}: Props){

    return (
        <div id="canvas-container" style={{position: 'relative'}}>
            <Canvas style={{height: '100vh'}}>
                <OrthographicCamera position={[0, 0, 10]} makeDefault zoom={100}/>
                <ambientLight/>
                <pointLight position={[10, 10, 10]}/>
                <Map/>
            </Canvas>
            <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" >This will be lobby</button>
            <button
                className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-1xl text-gray-700 font-serif p-4 rounded-lg hover:bg-amber-100"
                onClick={() => setGameState('inGame')}
            >Start
            </button>
        </div>

    );
}