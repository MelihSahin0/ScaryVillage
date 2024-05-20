import * as THREE from "three";
import React, {useState} from "react";
import {Player} from "../../PlayerManager";
import {Publish} from "../../TaskmanagerSocket";

type Props = {
    lobbyId: string;
    myPlayer: Player | undefined;
}

export default function Flooding({lobbyId, myPlayer}: Props) {

    const [isHovered, setIsHovered] = useState(false);

    const shovel = {x: -3.8, y: 0.16090551000000003 };

    const handlePointerOver = () => {
        setIsHovered(true);
    };

    const handlePointerOut = () => {
        setIsHovered(false);
    };

    const handleClick = () => {

        if(myPlayer?.role == "imposter") {
            console.log("TESTERS")
            const sabotageData = {
                lobbyId: lobbyId,
                playerId: myPlayer?.id,
                taskId: "Flooding",
            };
            Publish("/send/initiateSabotage", JSON.stringify(sabotageData));

        }
    };

    return (
        <group>
            <mesh
                position={new THREE.Vector3(shovel.x, shovel.y, 0.1)}
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                visible={false}
            >
                <boxGeometry args={[0.15, 0.15, 0.1]} />
                <meshBasicMaterial transparent={true} opacity={0} />
            </mesh>
            {isHovered && myPlayer?.role === "imposter" && (
                <lineSegments position={[shovel.x, shovel.y, 0.2]}>
                    <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.15, 0.4, 1)]} />
                    <lineBasicMaterial attach="material" color={0xffff00} />
                </lineSegments>
            )}
        </group>
    );
}
