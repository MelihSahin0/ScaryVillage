import {Player} from "../PlayerManager";
import React, {useEffect, useState} from "react";
import * as THREE from "three";
import {Task} from "./Map";
import {Text} from "@react-three/drei";
import {Scale} from "../InGame";

type Props = {
    progress: number;
    myPlayer: Player | undefined;
    tasks: Array<Task>;
    scale: Scale;
}

export default function TaskProgress({progress, myPlayer, tasks, scale}: Props){
    const [x, setX] = useState<number>(0)
    const [y, setY] = useState<number>(0)

    useEffect(() => {
        setX((myPlayer ? myPlayer.x  : 0) - ((scale.width - scale.width * 0.9988815) - (progress/2) - (0.25 - 0.025 * progress/0.1)));
        setY((myPlayer ? myPlayer.y  : 0) + (scale.height - scale.height * 0.99913));
    }, [progress, scale, myPlayer]);

    return (
        <group>
            <group>
                <mesh position={[x, y, 1]}>
                    <boxGeometry args={[progress/2, scale.height - scale.height * 0.999875, 2]}/>
                    <meshBasicMaterial attach="material" color="green"/>
                </mesh>
                <mesh position={[(myPlayer ? myPlayer.x : 0) - (scale.width - scale.width * 0.999226), y, 1]}>
                    <boxGeometry args={[(scale.width - scale.width * 0.999657), (scale.height - scale.height * 0.999872), 0.1]}/>
                    <meshBasicMaterial attach="material" color="gray"/>
                </mesh>
                <lineSegments position={[(myPlayer ? myPlayer.x : 0) - (scale.width - scale.width * 0.999226), y, 1]}>
                    <edgesGeometry attach="geometry"
                                   args={[new THREE.BoxGeometry((scale.width - scale.width * 0.999657), (scale.height - scale.height * 0.999872), 0.1)]}/>
                    <lineBasicMaterial attach="material" color={0x000000}/>
                </lineSegments>
            </group>
            {tasks.map((task, index) => (
                <Text key={task.taskId + "@"}
                      position={[(myPlayer ? myPlayer.x : 0) - (scale.width - scale.width * 0.99912), (myPlayer ? myPlayer.y  : 0) + (scale.height - (scale.height * (0.99913 + (index + 1) * 0.0001 ))), 2]}
                      scale={[0.04, 0.04, 0.04]}
                      color={(task.gameType === "Flooding" || task.gameType === "Fountain") ? "red" : "green"}>{task.gameType}</Text>
            ))}
        </group>
    );
}
