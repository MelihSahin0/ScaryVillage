import * as THREE from "three";
import React, {useState} from "react";
import {Publish} from "../PlayermanagerSocket";

type Props = {
    lobbyId: string;
    myPlayerId: string;
}

export default function BellMesh({lobbyId, myPlayerId}: Props){

    const [isHovered, setIsHovered] = useState(false);

    const handlePointerOver = () => {
        setIsHovered(true);
    };

    const handlePointerOut = () => {
        setIsHovered(false);
    };

    const handleClick = () => {
        const message = {
            "lobbyId": lobbyId,
            "fromPlayerId": myPlayerId,
            "toPlayerId": "emergency"
        };

        Publish("/send/report", JSON.stringify(message));
    };

    return (
        <group>
            <mesh position={new THREE.Vector3(0.1, 0.2, -1)} onClick={handleClick}
                  onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
                <boxGeometry args={[0.6, 0.5, 1]}/>
                <meshBasicMaterial transparent/>
            </mesh>
            <group visible={isHovered}>
                <lineSegments position={[0.1, 0.2, 1]}>
                    <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.6, 0.5, 1)]}/>
                    <lineBasicMaterial attach="material" color={0xFFFF00}/>
                </lineSegments>
            </group>
        </group>
    )
}