import {Player} from "../../PlayerManager";
import {Task} from "../Map";
import * as THREE from "three";
import React, {useEffect, useState} from "react";
import {calculateInsideMeshDistance} from "../../Utility";
import {Publish} from "../../TaskmanagerSocket";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: Player | undefined;
    tasks: Array<Task>
}

export default function ChoppingMesh({lobbyId, myPlayerId ,myPlayer, tasks}: Props){
    const meshPositions = [
        new THREE.Vector3(-3.68, 2.05, -1),
        new THREE.Vector3(0.18, -2.11, -1),
    ];
    const [isHovered, setIsHovered] = useState(Array.from({ length: 2 }, () => false));
    const [taskIds, setTaskIds] =useState(Array.from({ length: 2 }, () => ""));
    const [insideChoppingDistance, setInsideChoppingDistance] = useState(Array.from({ length: 2 }, () => false));
    useEffect(() => {
        const updatedTaskIds = Array.from({ length: 2 }, () => "");
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
            const insideDistance = insideChoppingDistance;
            meshPositions.map((mesh, index) => {
                insideDistance[index] = calculateInsideMeshDistance(mesh,myPlayer);
            })
            setInsideChoppingDistance(insideDistance);
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
                            <boxGeometry args={[0.55, 0.4, 1]}/>
                            <meshBasicMaterial transparent/>
                        </mesh>
                        <group visible={isHovered[index]}>
                            <lineSegments position={[meshPositions[index].x, meshPositions[index].y, 1]}>
                                <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.55, 0.4, 1)]}/>
                                <lineBasicMaterial attach="material" color={insideChoppingDistance[index] ? 0xFFFF00 : 0x808080}/>
                            </lineSegments>
                        </group>
                    </group>
                )
            ))}
        </group>
    )
}