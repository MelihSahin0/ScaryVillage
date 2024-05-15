import {Player} from "../../PlayerManager";
import * as THREE from "three";
import {useFrame} from "@react-three/fiber";
import React, {useEffect, useState} from "react";
import {Task} from "../Map";
import {Publish} from "../../TaskmanagerSocket";
import {TextureLoader} from "three";
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

export default function FishingMesh({lobbyId, myPlayerId ,myPlayer, taskId, setCurrentTask, setAllowedToMove, scale}: Props){
    const [fishPosition, setFishPosition] = useState<THREE.Vector3>(new THREE.Vector3(myPlayer!.x, myPlayer!.y, 5));
    const [fishVisible, setFishVisible] = useState<boolean>(false)
    const [texture, setTexture] = useState<THREE.Texture | null>(null);

    useState(() => {
        const initialTexture = new TextureLoader().load('src/Images/fish.png');
        initialTexture.magFilter = THREE.NearestFilter;
        initialTexture.minFilter = THREE.NearestFilter;
        setTexture(initialTexture);
    });

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        if (!fishVisible) {
            timeoutId = setTimeout(() => {
                setFishVisible(true);
            }, 1000);
        } else {
            timeoutId = setTimeout(() => {
                setFishVisible(false);
            }, 1000);
        }
        return () => clearTimeout(timeoutId);
    }, [fishVisible]);

    useFrame((state, delta) => {
        const angle = performance.now();

        const offsetX = Math.sin(angle/400) * 2.4 * delta;
        const offsetY = Math.sin(angle/355) * 1.5 * delta;

        const newX = fishPosition.x + offsetX;
        const newY = fishPosition.y + offsetY;

        const minX = myPlayer!.x - (scale.width - scale.width * 0.9992);
        const maxX = myPlayer!.x + (scale.width - scale.width * 0.9992);
        const maxY = myPlayer!.y - (scale.height - scale.height * 0.99925);
        const minY = myPlayer!.y + (scale.height - scale.height * 0.99925);

        const boundedX = Math.min(Math.max(newX, minX), maxX);
        const boundedY = Math.min(Math.max(newY, maxY), minY);

        setFishPosition(new THREE.Vector3(boundedX, boundedY, fishPosition.z));
    });

    return(
        <group>
            <mesh position={new THREE.Vector3(myPlayer?.x, myPlayer?.y, 2)}
                  scale={[scale.width/(0.4270833333333333*scale.width+(-35)), scale.height/(0.004669753812365262*(scale.height**2)+(-4.846533486941553)*(scale.height)+1627.4816620249615), scale.depth]}>
            <boxGeometry args={[1, 1, 0.1]}/>
                <meshBasicMaterial color={"blue"}/>
            </mesh>
            <mesh position={fishPosition} visible={fishVisible}
                  scale={[scale.width/580, scale.height/580, scale.depth]}
                  onClick={() => {
                     if (fishVisible) {
                         const taskFinished = {
                             lobbyId: lobbyId,
                             playerId: myPlayerId,
                             taskId: taskId
                         };
                         Publish("/send/taskFinished", JSON.stringify(taskFinished));

                         setAllowedToMove(true);
                         setCurrentTask(undefined);
                     }
                  }}>
                <boxGeometry args={[0.05, 0.08, 0.1]}/>
                <meshBasicMaterial map={texture} transparent={true}/>
            </mesh>
        </group>
    )
}