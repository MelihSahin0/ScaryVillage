import {Player} from "../PlayerManager";
import {Task} from "../Map";
import * as THREE from "three";
import React, {useEffect, useState} from "react";
import {calculateInsideMeshDistance} from "../Utility";
import {Publish} from "../TaskmanagerSocket";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: Player | undefined;
    tasks: Array<Task>
}

export default function BinMesh({lobbyId, myPlayerId ,myPlayer, tasks}: Props){
    const meshPositions = [
        new THREE.Vector3(1.97, 0.33, -1),
        new THREE.Vector3(-1.81, 0.55, -1),
        new THREE.Vector3(-1.59, -0.72, -1),
        new THREE.Vector3(2.9, -1.9, -1),
        new THREE.Vector3(4.25, -2.26, -1) //Cave
    ];
    const [isHovered, setIsHovered] = useState(Array.from({ length: 5 }, () => false));
    const [taskIds, setTaskIds] =useState(Array.from({ length: 5 }, () => ""));
    const [insideBinDistance, setInsideBinDistance] = useState(Array.from({ length: 5 }, () => false));
    useEffect(() => {
        const updatedTaskIds = Array.from({ length: 5 }, () => "");
        tasks.forEach((task) => {
            updatedTaskIds[task.targetId] = task.taskId;
        });

        setTaskIds(updatedTaskIds);
    }, [tasks]);

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
            const insideDistance = insideBinDistance;
            meshPositions.map((mesh, index) => {
                insideDistance[index] = calculateInsideMeshDistance(mesh,myPlayer);
            })
            setInsideBinDistance(insideDistance);
        }
    }, [myPlayer?.x, myPlayer?.y]);

    return (
        <group>
            {taskIds.map((taskId, index) => (
                taskId !== "" && (
                    <group key={taskId}>
                        <mesh key={index} position={meshPositions[index]} onPointerOver={() => handlePointerOver(index)}
                              onPointerOut={() => handlePointerOut(index)} onClick={() => {
                            const taskFinished = {
                                lobbyId: lobbyId,
                                playerId: myPlayerId,
                                taskId: taskId
                            };

                            Publish("/send/taskFinished", JSON.stringify(taskFinished));
                        }}>
                            <boxGeometry args={[0.6, 0.33, 1]}/>
                            <meshBasicMaterial transparent/>
                        </mesh>
                        <group visible={isHovered[index]}>
                            <lineSegments position={[meshPositions[index].x, meshPositions[index].y, 1]}>
                                <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.6, 0.33, 1)]}/>
                                <lineBasicMaterial attach="material" color={insideBinDistance[index] ? 0xFFFF00 : 0x808080}/>
                            </lineSegments>
                        </group>
                    </group>
                    )
            ))}
            {
                taskIds.some(task => task !== "") &&
                <group key={"cave"}>
                    <mesh key={"cave"} position={meshPositions[4]} onPointerOver={() => handlePointerOver(4)}
                          onPointerOut={() => handlePointerOut(4)}>
                        <boxGeometry args={[0.5, 0.47, 1]}/>
                        <meshBasicMaterial transparent/>
                    </mesh>
                    <group visible={isHovered[4]}>
                        <lineSegments position={[meshPositions[4].x, meshPositions[4].y, 1]}>
                            <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.5, 0.47, 1)]}/>
                            <lineBasicMaterial attach="material" color={insideBinDistance[4] ? 0xFFFF00 : 0x808080}/>
                        </lineSegments>
                    </group>
                </group>
            }
        </group>
    )
}