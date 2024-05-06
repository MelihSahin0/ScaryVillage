import {Player} from "../../PlayerManager";
import {Task} from "../Map";
import * as THREE from "three";
import {Text} from "@react-three/drei";
import React, {useState} from "react";
import {useLoader, useThree} from "@react-three/fiber";
import {TextureLoader} from "three";
import {Publish} from "../../TaskmanagerSocket";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: Player | undefined;
    taskId: string;
    setCurrentTask: (setCurrentTask: Task | undefined) => void;
    setAllowedToMove: (setAllowedToMove: boolean) => void;
}

function Stone(props: any) {
    const [isBroken, setIsBroken] = useState(false);

    const texture = useLoader(TextureLoader, isBroken ? 'src/Images/StoneBroken.png' : 'src/Images/Stone.png');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    const handleClick = () => {
        setIsBroken(true);
        if (props.onClick) props.onClick();
    };

    return (
        <mesh position={props.position} scale={props.scale} onClick={handleClick}>
            <boxGeometry args={[1, 1, 0.1]} />
            <meshBasicMaterial map={texture} transparent={true}/>
        </mesh>
    );
}

export default function MiningMesh({ lobbyId, myPlayerId, myPlayer, taskId, setCurrentTask, setAllowedToMove }: Props){

    const viewport = useThree(state => state.viewport)

    const texture = useLoader(TextureLoader, 'src/Images/MiningTask.png');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    const handleClick = (gem: boolean) => {
        //console.log('Mesh clicked! ', gem);

        const taskFinished = {
            lobbyId: lobbyId,
            playerId: myPlayerId,
            taskId: taskId
        };

        if(gem == true) {
            Publish("/send/taskFinished", JSON.stringify(taskFinished));
            setCurrentTask(undefined);
            setAllowedToMove(true);
        }
    };

    let stonesData = [
    ];

    for(let x = -3; x < 4; x++) {
        for(let y = -3; y < 2; y++) {
            stonesData.push({position: [x * 0.14, y*0.14, 3], scale: [0.14, 0.14, 1], broken: false, gem: false});
        }
    }

    //set one stone to the chosen one
    let randomGem = Math.floor(Math.random() * (34 - 0)) + 0
    stonesData[randomGem].gem = true;


    return (
        <group>
            <mesh position={new THREE.Vector3(myPlayer?.x, myPlayer?.y, 2)}
                  scale={[viewport.width - viewport.width / 10, viewport.height - viewport.height / 10, 1]}
                  >
                <boxGeometry args={[1, 1, 0.1]}/>
                <meshBasicMaterial map={texture}/>

                {stonesData.map((mesh, index) => (
                    <Stone
                        key={index}
                        position={mesh.position}
                        scale={mesh.scale}
                        texture={mesh.broken}
                        onClick={() => handleClick(mesh.gem)}
                    />
                ))}

            </mesh>
        </group>
    )
}