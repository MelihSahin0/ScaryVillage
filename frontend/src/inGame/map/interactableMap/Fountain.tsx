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

export default function Fountain({lobbyId, myPlayer, setCurrentTask, tasks}: Props) {
    const [isHovered, setIsHovered] = useState(Array.from({ length: 2 }, () => false));
    const [insideDistance, setInsideDistance] = useState(Array.from({ length: 2 }, () => false));
    const audioSrc = "/sounds/click_effect.mp3";
    const soundRef = useRef<THREE.PositionalAudio | null>(null);

    const fountain = [{taskId: "Fountain1", x: 0.11, y: -0.95 }, {taskId: "Fountain2", x: 0.08 , y: 1.3}];

    const handlePointerOver = (index: number) => {
        setIsHovered(prevIsHovered => {
            const updatedHovered = [...prevIsHovered];
            updatedHovered[index] = true;
            return updatedHovered;
        });
    };

    const handlePointerOut = (index: number) => {
        setIsHovered(prevIsHovered => {
            const updatedHovered = [...prevIsHovered];
            updatedHovered[index] = false;
            return updatedHovered;
        });
    };

    useEffect(() => {
        if (myPlayer !== null && myPlayer !== undefined) {
            const insideDistance2 = insideDistance;
            fountain.map((task, index) => {
                if (tasks.length == 0) {
                    insideDistance2[index] = calculateInsideClickRange(fountain[index], myPlayer, 100);
                } else {
                    insideDistance2[index] = calculateInsideClickRange(tasks[index].position, myPlayer, tasks[index].radius);
                }
            })
            setInsideDistance(insideDistance2);
        }
    }, [myPlayer?.x, myPlayer?.y, tasks]);

    const handleClick = (index: number) => {
        soundRef.current?.setVolume(1)
        soundRef.current?.play();
        if (tasks.length === 0) {
            const sabotageData = {
                lobbyId: lobbyId,
                playerId: myPlayer?.id,
                taskId: "Fountain",
            };
            Publish("/send/initiateSabotage", JSON.stringify(sabotageData));
        } else if (insideDistance[index]) {
            setCurrentTask(tasks[index]);
        }
    };

    return (
        <group>
            {fountain.map((task, index) => (
                <group key={task.taskId}>
                    <mesh
                        position={tasks.length == 0 ? new THREE.Vector3(fountain[index].x, fountain[index].y, 0.1) : new THREE.Vector3(tasks[index].position.x, tasks[index].position.y, 0.1)}
                        onClick={() => handleClick(index)}
                        onPointerOver={() => handlePointerOver(index)}
                        onPointerOut={() => handlePointerOut(index)}
                    >
                        <boxGeometry args={[0.56, 0.5, 0.1]}/>
                        <PositionalAudio ref={soundRef} url={audioSrc} loop={false} distance={1}/>
                        <meshBasicMaterial transparent={true} opacity={0}/>
                    </mesh>
                    <group visible={isHovered[index] !== undefined && isHovered[index]}>
                        <lineSegments
                            position={tasks.length == 0 ? new THREE.Vector3(fountain[index].x, fountain[index].y, 0.2) : new THREE.Vector3(tasks[index].position.x, tasks[index].position.y, 0.2)}>
                            <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.56, 0.5, 1)]}/>
                            <lineBasicMaterial attach="material" color={insideDistance[index] ? 0xFFFF00 : 0x808080}/>
                        </lineSegments>
                    </group>
                </group>
            ))}
        </group>
    );
}
