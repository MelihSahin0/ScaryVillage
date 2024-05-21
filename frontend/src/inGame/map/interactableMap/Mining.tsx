import {Player} from "../../PlayerManager";
import {Task} from "../Map";
import * as THREE from "three";
import React, {useRef, useState} from "react";
import {useLoader} from "@react-three/fiber";
import {TextureLoader} from "three";
import {Publish} from "../../TaskmanagerSocket";
import {Scale} from "../../InGame";
import {PositionalAudio} from "@react-three/drei";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: Player | undefined;
    taskId: string;
    setCurrentTask: (setCurrentTask: Task | undefined) => void;
    setAllowedToMove: (setAllowedToMove: boolean) => void;
    scale: Scale;
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

export default function MiningMesh({ lobbyId, myPlayerId, myPlayer, taskId, setCurrentTask, setAllowedToMove, scale}: Props){
    const texture = useLoader(TextureLoader, 'src/Images/MiningTask.png');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    const audioSrc = "../../../public/sounds/rock_break.mp3";
    const soundRef = useRef<THREE.PositionalAudio | null>(null);

    const handleClick = (gem: boolean) => {
        if (!soundRef.current?.isPlaying){
            soundRef.current?.play();
        }
        const taskFinished = {
            lobbyId: lobbyId,
            playerId: myPlayerId,
            taskId: taskId
        };

        if(gem) {
            Publish("/send/taskFinished", JSON.stringify(taskFinished));
            setCurrentTask(undefined);
            setAllowedToMove(true);
        }
    };

    const stonesData = [
    ];

    for(let x = -3; x < 4; x++) {
        for(let y = -3; y < 2; y++) {
            stonesData.push({position: [x * 0.14, y*0.14, 3], scale: [0.14, 0.14, 1], broken: false, gem: false});
        }
    }

    //set one stone to the chosen one
    const randomGem = Math.floor(Math.random() * 34);
    stonesData[randomGem].gem = true;

    return (
        <group>
            <PositionalAudio ref={soundRef} url={audioSrc} loop={false} distance={1}/>
            <mesh position={new THREE.Vector3(myPlayer?.x, myPlayer?.y, 2)}
                  scale={[scale.width/(0.4270833333333333*scale.width+(-35)), scale.height/(0.004669753812365262*(scale.height**2)+(-4.846533486941553)*(scale.height)+1627.4816620249615), scale.depth]}>
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