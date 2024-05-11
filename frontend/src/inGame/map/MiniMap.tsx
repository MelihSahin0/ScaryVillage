import {Player} from "../PlayerManager";
import * as THREE from "three";
import React from "react";
import {useLoader, useThree} from "@react-three/fiber";
import {TextureLoader} from "three";
import {Task} from "./Map";

type Props = {
    myPlayer: Player | undefined;
    tasks: Array<Task>;
    currentTask: Task | undefined;
}

export default function MiniMap({myPlayer, tasks, currentTask}: Props) {
    const { viewport } = useThree(state => state); // Destructure viewport from useThree directly
    const mapTexture = useLoader(TextureLoader, 'src/Images/newMap.png');
    mapTexture.magFilter = THREE.NearestFilter;
    mapTexture.minFilter = THREE.NearestFilter;
    const playerTexture = useLoader(TextureLoader, myPlayer!.src);
    playerTexture.magFilter = THREE.NearestFilter;
    playerTexture.minFilter = THREE.NearestFilter;
    const displayTasks = currentTask?.gameType === "Cave" ? [...tasks, currentTask] : tasks;

    return (
        <group>
            <mesh position={new THREE.Vector3(myPlayer?.x, myPlayer?.y, 2)}
                  scale={[viewport.width - viewport.width / 10, viewport.height - viewport.height / 10, 1]}>
                <boxGeometry args={[1, 1, 0.1]}/>
                <meshBasicMaterial map={mapTexture}/>
            </mesh>
            <mesh position={[myPlayer ? myPlayer.x * 1.28 : 0, myPlayer ? myPlayer.y * 1.25 : 0, 3]}>
                <planeGeometry attach="geometry" args={[0.07, 0.07, 1]}/>
                <meshBasicMaterial transparent={true} map={playerTexture} color={myPlayer?.color}/>
            </mesh>
            {currentTask === undefined && //Emergency
                <group
                    visible={myPlayer?.role === "crewmate" || myPlayer?.role === "imposter"}>
                    <lineSegments position={new THREE.Vector3(
                        0.1 / 3.62 + (myPlayer ? myPlayer.x * 1.28 : 0) - (myPlayer ? myPlayer.x * 1.28 : 0) / 4.57,
                        0.2 / 3.95 + (myPlayer ? myPlayer.y * 1.25 : 0) - (myPlayer ? myPlayer.y * 1.25 : 0) / 5,
                        3

                    )}>
                        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.6 / 3.5, 0.5 / 4, 3)]}/>
                        <lineBasicMaterial attach="material" color={0xFFFF00}/>
                    </lineSegments>
                </group>
            }
            {displayTasks.map((task) => {
                if (currentTask === undefined || currentTask!.taskId === task.taskId) {
                    return (
                        <group key={task.taskId}>
                            <group>
                                <lineSegments
                                    position={new THREE.Vector3(
                                        task.position.x / 3.62 + (myPlayer ? myPlayer.x * 1.28 : 0) - (myPlayer ? myPlayer.x * 1.28 : 0) / 4.57,
                                        task.position.y / 3.95 + (myPlayer ? myPlayer.y * 1.25 : 0) - (myPlayer ? myPlayer.y * 1.25 : 0) / 5,
                                        3
                                    )}>
                                    <edgesGeometry attach="geometry"
                                                   args={[new THREE.BoxGeometry(task.scale.width / 3.5, task.scale.height / 4, task.scale.depth)]}/>
                                    <lineBasicMaterial attach="material" color={0xFFFF00}/>
                                </lineSegments>
                            </group>
                        </group>
                    );
                } else {
                    return null;
                }
            })}
        </group>
    );
}