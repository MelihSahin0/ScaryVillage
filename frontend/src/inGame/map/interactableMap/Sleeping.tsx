import {Player} from "../../PlayerManager";
import * as THREE from "three";
import {useLoader} from "@react-three/fiber";
import {TextureLoader} from "three";
import {Publish} from "../../TaskmanagerSocket";
import React, {useEffect, useState} from "react";
import {Text} from "@react-three/drei";
import {Task} from "../Map";
import {Scale} from "../../InGame";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: Player | undefined;
    taskId: string;
    setCurrentTask:(setCurrentTask: Task | undefined) => void;
    setAllowedToMove:(setAllowedToMove: boolean) => void;
    scale: Scale;
}

export default function SleepingMesh({lobbyId, myPlayerId ,myPlayer, taskId, setCurrentTask, setAllowedToMove, scale}: Props){
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
            const taskFinished = {
                lobbyId: lobbyId,
                playerId: myPlayerId,
                taskId: taskId
            };
            Publish("/send/taskFinished", JSON.stringify(taskFinished));
            setCurrentTask(undefined);
            setAllowedToMove(true);
        }
    }, [remainingTime, lobbyId, myPlayerId, taskId, setCurrentTask]);

    return(
        <group>
        <mesh position={new THREE.Vector3(myPlayer?.x, myPlayer?.y, 2)}
              scale={[scale.width/(0.4270833333333333*scale.width+(-35)), scale.height/(0.004669753812365262*(scale.height**2)+(-4.846533486941553)*(scale.height)+1627.4816620249615), scale.depth]}>
        <boxGeometry args={[1, 1, 0.1]}/>
            <meshBasicMaterial map={texture}/>
        </mesh>
            {<Text position={new THREE.Vector3(myPlayer?.x, myPlayer?.y, 3)}
                   scale={[scale.width/(12.5*scale.width+2000), scale.height/(0.026041087702004067*(scale.height**2)+(-18.48551443522764)*(scale.height)+9597.56938662081), scale.depth]} color="#ffffff">{remainingTime/1000} sec</Text>}
        </group>
    )
}