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
        setX((myPlayer ? myPlayer.x : 0) - scale.width/(6.380605492390803e-12*(scale.width**5)+(-5.383217133258679e-8)*(scale.width**4)+0.00017469940439592224*(scale.width**3)+(-0.2736269684198816)*(scale.width**2)+208.46531535584379*(scale.width)+(-61185.342862383186)));
        setY((myPlayer ? myPlayer.y  : 0) + scale.height/((-2.7106488710419056e-9)*(scale.height**5)+0.000009532025745222727*(scale.height**4)+(-0.013111890971173337)*(scale.height**3)+8.816587259194831*(scale.height**2)+(-2895.242032601652)*(scale.height)+372096.4701636151));
    }, [progress, scale, myPlayer]);

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
