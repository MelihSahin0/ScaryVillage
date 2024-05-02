import {Player} from "../../PlayerManager";
import {Task} from "../Map";
import * as THREE from "three";
import {useLoader, useThree} from "@react-three/fiber";
import {TextureLoader} from "three";
import {Publish} from "../../TaskmanagerSocket";
import React, {useEffect, useState} from "react";
import {Text} from "@react-three/drei";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: Player | undefined;
    tasks: Array<Task>
    taskId: any,
    setCurrentTask: any
}

export default function SleepingMesh({lobbyId, myPlayerId ,myPlayer, tasks, taskId, setCurrentTask}: Props){
    const viewport = useThree(state => state.viewport)

    const texture = useLoader(TextureLoader, 'src/Images/SleepingTask.png');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    const [remainingTime, setRemainingTime] = useState<number>(10000);

    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime(prevTime => prevTime - 1000); // Decrease remaining time by 1 second
        }, 1000);

        return () => clearInterval(timer); // Cleanup on unmount
    }, []);

    useEffect(() => {
        if (remainingTime <= 0) {
            const doTaskRequest = {
                lobbyId: lobbyId,
                playerId: myPlayerId,
                taskId: taskId
            };
            Publish("/send/taskFinished", JSON.stringify(doTaskRequest));
            setCurrentTask(undefined);
        }
    }, [remainingTime, lobbyId, myPlayerId, taskId, setCurrentTask]);

    return(
        <group>
        <mesh position={new THREE.Vector3(myPlayer?.x, myPlayer?.y, 2)} scale={[viewport.width-viewport.width/10, viewport.height-viewport.height/10, 1]}>
            <boxGeometry args={[1, 1, 0.1]}/>
            <meshBasicMaterial map={texture}/>
        </mesh>
            {<Text position={new THREE.Vector3(myPlayer?.x, myPlayer?.y, 3)} scale={[viewport.width/8, viewport.height/8, 1]} color="#ffffff">{remainingTime/1000} sec</Text>}

        </group>
    )
}