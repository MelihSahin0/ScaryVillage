import {Player} from "../PlayerManager";
import * as THREE from "three";
import React from "react";
import {useLoader, useThree} from "@react-three/fiber";
import {TextureLoader} from "three";
import {Task} from "./Map";
import {Scale} from "../InGame";

type Props = {
    myPlayer: Player | undefined;
    tasks: Array<Task>;
    currentTask: Task | undefined;
    scale: Scale;
}

export default function MiniMap({myPlayer, tasks, currentTask, scale}: Props) {
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
                  scale={[scale.width/(0.4270833333333333*scale.width+(-35)), scale.height/(0.004669753812365262*(scale.height**2)+(-4.846533486941553)*(scale.height)+1627.4816620249615), scale.depth]}>
            <boxGeometry args={[1, 1, 0.1]}/>
                <meshBasicMaterial map={mapTexture}/>
            </mesh>
            <mesh position={[myPlayer ? myPlayer.x * ((-0.00001041666666666609)*scale.width+1.295) : 0, myPlayer ? myPlayer.y * ((-0.0000010357628500816756)*(scale.height**2)+0.001245800873609301*(scale.height)+0.8927908337240951) : 0, 3]}>
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
                                        task.position.x / (0.00014583333333333318*scale.width+3.41) + (myPlayer ? myPlayer.x * 1.28 : 0) - (myPlayer ? myPlayer.x * 1.28 : 0) / 4.57,
                                        task.position.y / (0.000047402450041123594*(scale.height**2)+(-0.057330966320548724)*(scale.height)+20.528915773896273) + (myPlayer ? myPlayer.y * 1.25 : 0) - (myPlayer ? myPlayer.y * 1.25 : 0) / 5,
                                        3
                                    )}>
                                    <edgesGeometry attach="geometry"
                                                   args={[new THREE.BoxGeometry(task.scale.width / 3.5, task.scale.height / 3.5, task.scale.depth)]}/>
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