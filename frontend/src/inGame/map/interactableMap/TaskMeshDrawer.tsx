import {Player} from "../../PlayerManager";
import {Task} from "../Map";
import * as THREE from "three";
import React, {useEffect, useRef, useState} from "react";
import {calculateInsideClickRange} from "../../Utility";
import {Publish} from "../../TaskmanagerSocket";
import {PositionalAudio} from "@react-three/drei";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: Player | undefined;
    tasks: Array<Task>;

}

export default function TaskMeshDrawer({lobbyId, myPlayerId, myPlayer, tasks}: Props){

    const [isHovered, setIsHovered] = useState(Array.from({ length: tasks.length }, () => false));
    const [insideBinDistance, setInsideBinDistance] = useState(Array.from({ length: tasks.length }, () => false));
    const audioSrc = "../../../public/sounds/click_effect.mp3";
    const soundRef = useRef<THREE.PositionalAudio | null>(null);

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
            tasks.map((task, index) => {
                insideDistance[index] = calculateInsideClickRange(task.position, myPlayer, task.radius);
            })
            setInsideBinDistance(insideDistance);
        }
    }, [myPlayer?.x, myPlayer?.y, tasks]);

    return (
        <group>
            {tasks.map((task, index) => (
                <group key={task.taskId}>

                    <mesh key={index} position={new THREE.Vector3(task.position.x, task.position.y, task.position.z)} onPointerOver={() => handlePointerOver(index)}
                          onPointerOut={() => handlePointerOut(index)} onClick={() => {
                              if (isHovered[index] && insideBinDistance[index]) {
                                  soundRef.current?.setVolume(1)
                                  soundRef.current?.play();
                              }

                            setTimeout(() =>{
                        const doTaskRequest = {
                            lobbyId: lobbyId,
                            playerId: myPlayerId,
                            taskId: task.taskId
                        };
                        if (isHovered[index] && insideBinDistance[index]) {
                            Publish("/send/doTaskRequest", JSON.stringify(doTaskRequest));
                        }}
                        ,1000);
                    }}>
                        <boxGeometry args={[task.scale.width, task.scale.height, task.scale.depth]}/>
                        <PositionalAudio ref={soundRef} url={audioSrc} loop={false} distance={1}/>
                        <meshBasicMaterial transparent/>
                    </mesh>
                    <group visible={isHovered[index] !== undefined && isHovered[index]}>
                        <lineSegments position={new THREE.Vector3(task.position.x, task.position.y, -task.position.z)} >
                            <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(task.scale.width, task.scale.height, task.scale.depth)]}/>
                            <lineBasicMaterial attach="material" color={insideBinDistance[index] ? 0xFFFF00 : 0x808080}/>
                        </lineSegments>
                    </group>
                </group>
            ))}
        </group>
    )
}