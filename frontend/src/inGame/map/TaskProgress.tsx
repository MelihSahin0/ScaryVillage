import {Player} from "../PlayerManager";
import React, {useEffect, useState} from "react";
import * as THREE from "three";
import {Task} from "./Map";
import {Text} from "@react-three/drei";

type Props = {
    progress: number;
    myPlayer: Player | undefined;
    tasks: Array<Task>;
}

export default function TaskProgress({progress, myPlayer, tasks}: Props){
    const [x, setX] = useState<number>(0)
    const [y, setY] = useState<number>(0)
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    useEffect(() => {
        setX((myPlayer ? myPlayer.x  : 0) - (windowSize.width / 1010 - progress/4));
        setY((myPlayer ? myPlayer.y  : 0) + windowSize.height / 1100);
    }, [progress, windowSize.height, windowSize.width, myPlayer]);

    return (
        <group>
            <group>
                <mesh position={[x, y, 1]}>
                    <boxGeometry args={[progress / 2, windowSize.height / 8000, 2]}/>
                    <meshBasicMaterial attach="material" color="green"/>
                </mesh>
                <mesh position={[(myPlayer ? myPlayer.x : 0) - (windowSize.width / 1010 - 1 / 4), y, 1]}>
                    <boxGeometry args={[1 / 2, windowSize.height / 8000, 0.1]}/>
                    <meshBasicMaterial attach="material" color="gray"/>
                </mesh>
                <group>
                    <lineSegments position={[(myPlayer ? myPlayer.x : 0) - (windowSize.width / 1010 - 1 / 4), y, 1]}>
                        <edgesGeometry attach="geometry"
                                       args={[new THREE.BoxGeometry(1 / 2, windowSize.height / 8000, 0.1)]}/>
                        <lineBasicMaterial attach="material" color={0x000000}/>
                    </lineSegments>
                </group>
            </group>
            {tasks.map((task, index) => (
                <Text key={task.taskId + "@"} position={[(myPlayer ? myPlayer.x : 0) - (windowSize.width / 1010 - 1 / 10), y - (index + 1)/15, 2]} scale={[0.04, 0.04, 0.04]}
                      color={(task.gameType === "Flooding" || task.gameType === "Fountain") ? "red" : "green"}>{task.gameType}</Text>
            ))}
        </group>
    );
}
