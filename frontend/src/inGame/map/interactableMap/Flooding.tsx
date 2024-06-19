import * as THREE from "three";
import React, {useEffect, useRef, useState} from "react";
import {Player} from "../../PlayerManager";
import {Publish} from "../../TaskmanagerSocket";
import {Task} from "../Map";
import {PositionalAudio} from "@react-three/drei";
import {calculateInsideClickRange} from "../../Utility";

type Props = {
    lobbyId: string;
    myPlayer: Player | undefined;
    setCurrentTask:(setCurrentTask: Task | undefined) => void;
    tasks: Array<Task>;
}

export default function Flooding({lobbyId, myPlayer, setCurrentTask, tasks}: Props) {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [insideDistance, setInsideDistance] = useState<boolean>(false)
    const audioSrc = "/sounds/click_effect.mp3";
    const soundRef = useRef<THREE.PositionalAudio | null>(null);

    const shovel = {x: -3.8, y: 0.16090551000000003 };

    const handlePointerOver = () => {
        setIsHovered(true);
    };

    const handlePointerOut = () => {
        setIsHovered(false);
    };

    const handleClick = () => {
        soundRef.current?.play()
        if (tasks.length === 0) {
            const sabotageData = {
                lobbyId: lobbyId,
                playerId: myPlayer?.id,
                taskId: "Flooding",
            };
            Publish("/send/initiateSabotage", JSON.stringify(sabotageData));
        } else if (insideDistance && myPlayer?.role !== "crewmateGhost" && myPlayer?.role !== "imposterGhost") {
            setCurrentTask(tasks[0]);
        }
    };

    useEffect(() => {
        if (myPlayer !== null && myPlayer !== undefined) {
            if (tasks.length == 0) {
                setInsideDistance(calculateInsideClickRange(shovel, myPlayer, 100));
            } else {
                setInsideDistance(calculateInsideClickRange(tasks[0].position, myPlayer, tasks[0].radius));
            }
        }
    }, [myPlayer?.x, myPlayer?.y, tasks]);

    return (
        <group>
            <mesh
                position={tasks.length == 0 ? new THREE.Vector3(shovel.x, shovel.y, 0.1)  : new THREE.Vector3(tasks[0].position.x, tasks[0].position.y, 0.1)}
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
            >
                <boxGeometry args={[0.15, 0.15, 0.1]} />
                <PositionalAudio ref={soundRef} url={audioSrc} loop={false} distance={1}/>
                <meshBasicMaterial transparent={true} opacity={0} />
            </mesh>
            {isHovered && myPlayer?.role !== "crewmateGhost" && myPlayer?.role !== "imposterGhost" && (
                <lineSegments position={tasks.length == 0 ? new THREE.Vector3(shovel.x, shovel.y, 0.2)  : new THREE.Vector3(tasks[0].position.x, tasks[0].position.y, 0.2)}>
                    <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.15, 0.4, 1)]} />
                    <lineBasicMaterial attach="material" color={insideDistance ? 0xFFFF00 : 0x808080}/>
                </lineSegments>
            )}
        </group>
    );
}
