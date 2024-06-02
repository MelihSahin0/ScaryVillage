import * as THREE from "three";
import React, {useState} from "react";
import {Player} from "../../PlayerManager";
import {Publish} from "../../TaskmanagerSocket";
import {Task} from "../Map";

type Props = {
    lobbyId: string;
    myPlayer: Player | undefined;
    setCurrentTask:(setCurrentTask: Task | undefined) => void;
    tasks: undefined;
    xCoor: number;
    yCoor: number;
    i: number;
}

export default function Fountain({lobbyId, myPlayer, setCurrentTask, tasks, xCoor, yCoor, i}: Props) {

    const [isHovered, setIsHovered] = useState(false);

    const fountain = {x: xCoor, y: yCoor };
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
                taskId: "Fountain",
            };
            Publish("/send/initiateSabotage", JSON.stringify(sabotageData));
        }
        console.log("CREWMATE " + tasks[0].gameType);
        // safety check that tasks are defined
        if (tasks && myPlayer.role == "crewmate") {
            setCurrentTask(tasks[i]);
        }

    };

    return (
        <group>
            <mesh
                position={new THREE.Vector3(fountain.x, fountain.y, 0.1)}
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                visible={false}
            >
                <boxGeometry args={[0.56, 0.5, 0.1]} />
                <meshBasicMaterial transparent={true} opacity={0} />
            </mesh>
            {isHovered && (
                <lineSegments position={[fountain.x, fountain.y, 0.2]}>
                    <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.56, 0.5, 1)]} />
                    <lineBasicMaterial attach="material" color={0xffff00} />
                </lineSegments>
            )}
        </group>
    );
}
