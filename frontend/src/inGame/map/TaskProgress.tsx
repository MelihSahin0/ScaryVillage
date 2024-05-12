import {Player} from "../PlayerManager";
import React, {useEffect, useState} from "react";
import * as THREE from "three";
import {Task} from "./Map";
import {GradientTexture, Text} from "@react-three/drei";
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
        setX((myPlayer ? myPlayer.x : 0) - scale.width/(7.447225998101889e-10*(scale.width**4)+(-0.000003066331427590448)*(scale.width**3)+0.004154373787658552*(scale.width**2)+(-1.1902304136294832)*(scale.width)+353.26802586077287));
        setY((myPlayer ? myPlayer.y  : 0) + scale.height/((-1.2205784652067209e-8)*(scale.height**4)+0.000028236507376327234*(scale.height**3)+(-0.01867595178650694)*(scale.height**2)+4.774846240167487*(scale.height)+114.8629452562877));
    }, [progress, scale, myPlayer]);

    console.log(scale.height)

    return (
        <group>
            <group>
                <mesh rotation={[0, 0, Math.PI/2]}
                      position={[x, y, 1]}>
                    <boxGeometry args={[(scale.height - scale.height * 0.999872),(scale.width - scale.width * 0.999657),0.1]}/>
                    <meshBasicMaterial attach="material">
                        <GradientTexture
                            stops={[progress, progress]}
                            colors={['red', 'green']}
                        />
                    </meshBasicMaterial>
                </mesh>
                <lineSegments position={[x, y, 1]}>
                    <edgesGeometry attach="geometry"
                                   args={[new THREE.BoxGeometry((scale.width - scale.width * 0.999657), (scale.height - scale.height * 0.999872), 0.1)]}/>
                    <lineBasicMaterial attach="material" color={0x000000}/>
                </lineSegments>
            </group>
            {tasks.map((task, index) => (
                <Text key={task.taskId + "@"}
                      position={[x - scale.width/12000, y - (0.02 + (index + 1) * 0.06 ), 2]}
                      scale={[0.04, 0.04, 0.04]}
                      color={(task.gameType === "Flooding" || task.gameType === "Fountain") ? "red" : "green"}>{task.gameType}</Text>
            ))}
        </group>
    );
}
