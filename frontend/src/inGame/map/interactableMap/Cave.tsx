import {Player} from "../../PlayerManager";
import {Task} from "../Map";
import React, {useEffect, useRef, useState} from "react";
import {calculateInsideClickRange} from "../../Utility";
import * as THREE from "three";
import {Publish} from "../../TaskmanagerSocket";
import {PositionalAudio} from "@react-three/drei";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: Player | undefined;
    currentTask: Task;
    setCurrentTask:(setCurrentTask: Task | undefined) => void;
}

export default function CaveMesh({lobbyId, myPlayerId ,myPlayer, currentTask, setCurrentTask}: Props){
    const [isHovered, setIsHovered] = useState(false);
    const [insideBinDistance, setInsideBinDistance] = useState(false);
    const audioSrc = "/sounds/snare.mp3";
    const soundRef = useRef<THREE.PositionalAudio | null>(null);

    const handlePointerOver = () => {
        setIsHovered(true);
    };

    const handlePointerOut = () => {
        setIsHovered(false);
    };

    useEffect(() => {
        if (myPlayer !== null && myPlayer !== undefined) {
            const insideDistance = calculateInsideClickRange(currentTask.position, myPlayer, currentTask.radius);
            setInsideBinDistance(insideDistance);
        }
    }, [currentTask, myPlayer]);

    return (
        <group>
            <group key={currentTask.taskId}>
                <mesh key={currentTask.taskId} position={new THREE.Vector3(currentTask.position.x, currentTask.position.y, currentTask.position.z)} onPointerOver={() => handlePointerOver()}
                      onPointerOut={() => handlePointerOut()} onClick={() => {
                    if (isHovered && insideBinDistance) {
                        soundRef.current?.setVolume(1)
                        soundRef.current?.play();
                    }

                    setTimeout(() =>{
                    const doTaskRequest = {
                        lobbyId: lobbyId,
                        playerId: myPlayerId,
                        taskId: currentTask.taskId
                    };

                    if (isHovered && insideBinDistance) {
                        Publish("/send/taskFinished", JSON.stringify(doTaskRequest));
                        setCurrentTask(undefined);
                    }}
                    ,1000);
                }}>
                    <boxGeometry args={[currentTask.scale.width, currentTask.scale.height, currentTask.scale.depth]}/>
                    <PositionalAudio ref={soundRef} url={audioSrc} loop={false} distance={1}/>
                    <meshBasicMaterial transparent/>
                </mesh>
                <group visible={isHovered !== undefined && isHovered}>
                    <lineSegments position={new THREE.Vector3(currentTask.position.x, currentTask.position.y, -currentTask.position.z)} >
                        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(currentTask.scale.width, currentTask.scale.height, currentTask.scale.depth)]}/>
                        <lineBasicMaterial attach="material" color={insideBinDistance ? 0xFFFF00 : 0x808080}/>
                    </lineSegments>
                </group>
            </group>
        </group>
    )
}