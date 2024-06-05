import * as THREE from "three";
import React, {useRef, useState} from "react";
import {Player} from "../../PlayerManager";
import {Publish} from "../../TaskmanagerSocket";
import {Task} from "../Map";
import {PositionalAudio} from "@react-three/drei";

type Props = {
    lobbyId: string;
    myPlayer: Player | undefined;
    setCurrentTask:(setCurrentTask: Task | undefined) => void;
    tasks: any;
    xCoor: number;
    yCoor: number;
    i: number;
}

export default function Fountain({lobbyId, myPlayer, setCurrentTask, tasks, xCoor, yCoor, i}: Props) {

    const [isHovered, setIsHovered] = useState(false);
    const audioSrc = "/sounds/click_effect.mp3";
    const soundRef = useRef<THREE.PositionalAudio | null>(null);

    const fountain = {x: xCoor, y: yCoor };
    const handlePointerOver = () => {
        setIsHovered(true);
    };

    const handlePointerOut = () => {
        setIsHovered(false);
    };

    const handleClick = () => {

        soundRef.current?.setVolume(1)
        soundRef.current?.play();
        if(myPlayer?.role == "imposter") {
            const sabotageData = {
                lobbyId: lobbyId,
                playerId: myPlayer?.id,
                taskId: "Fountain",
            };
            Publish("/send/initiateSabotage", JSON.stringify(sabotageData));
        }
        // safety check that tasks are defined
        if (tasks && myPlayer!.role == "crewmate") {
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
                <PositionalAudio ref={soundRef} url={audioSrc} loop={false} distance={1}/>
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
