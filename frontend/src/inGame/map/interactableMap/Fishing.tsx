import {Player} from "../../PlayerManager";
import * as THREE from "three";
import {useFrame, useThree} from "@react-three/fiber";
import React, {useEffect, useState} from "react";
import {Task} from "../Map";
import {Publish} from "../../TaskmanagerSocket";
import {TextureLoader} from "three";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: Player | undefined;
    taskId: string;
    setCurrentTask:(setCurrentTask: Task | undefined) => void;
    setAllowedToMove:(setAllowedToMove: boolean) => void;
}

export default function FishingMesh({lobbyId, myPlayerId ,myPlayer, taskId, setCurrentTask, setAllowedToMove}: Props){
    const viewport = useThree(state => state.viewport)
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
                // Set the initial chicken positions after 1 second
                setFishVisible(true);
            }, 1000);
        } else {
            timeoutId = setTimeout(() => {
                // Set the initial chicken positions after 1 second
                setFishVisible(false);
            }, 1000);
        }
        return () => clearTimeout(timeoutId);
    }, [fishVisible]);

    useFrame((state, delta) => {
        const angle = performance.now();

        const offsetX = Math.sin(angle/400) * 2.4 * delta + 0.00005;
        const offsetY = Math.sin(angle/355) * 1.4 * delta;

        const newX = fishPosition.x + offsetX;
        const newY = fishPosition.y + offsetY;

        const minX = myPlayer!.x - (viewport.width - viewport.width / 10) / 2.3;
        const maxX = myPlayer!.x + (viewport.width - viewport.width / 10) / 2.2;
        const minY = myPlayer!.y - 0.43 - (viewport.height - viewport.height / 10) / 14;
        const maxY = myPlayer!.y - 0.43 + (viewport.height - viewport.height / 10) / 1.3;

        const boundedX = Math.min(Math.max(newX, minX), maxX);
        const boundedY = Math.min(Math.max(newY, minY), maxY);

        setFishPosition(new THREE.Vector3(boundedX, boundedY, fishPosition.z));

    });

    return(
        <group>
            <mesh position={new THREE.Vector3(myPlayer?.x, myPlayer?.y, 2)}
                  scale={[viewport.width - viewport.width / 10, viewport.height - viewport.height / 10, 1]}>
                <boxGeometry args={[1, 1, 0.1]}/>
                <meshBasicMaterial color={"blue"}/>
            </mesh>
            <mesh position={fishPosition} visible={fishVisible}
                  scale={[viewport.width - viewport.width / 10, viewport.height - viewport.height / 10, 1]}
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