import { Player } from "../../PlayerManager";
import { Task } from "../Map";
import * as THREE from "three";
import React, {useRef, useState} from "react";
import { TextureLoader } from "three";
import { Publish } from "../../TaskmanagerSocket";
import {PositionalAudio, Text} from "@react-three/drei";
import {Scale} from "../../InGame";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: Player | undefined;
    taskId: string;
    setCurrentTask: (setCurrentTask: Task | undefined) => void;
    setAllowedToMove: (setAllowedToMove: boolean) => void;
    scale: Scale;
}

export default function ChoppingMesh({ lobbyId, myPlayerId, myPlayer, taskId, setCurrentTask, setAllowedToMove, scale}: Props) {
    const [texture, setTexture] = useState<THREE.Texture | null>(null);

    // Load initial texture
    useState(() => {
        const initialTexture = new TextureLoader().load("/images/chopping1.png");
        initialTexture.magFilter = THREE.NearestFilter;
        initialTexture.minFilter = THREE.NearestFilter;
        setTexture(initialTexture);
    });

    const [count, setCount] = useState<number>(1);
    const [amount, setAmount] = useState<number>(10);
    const audioSrc = "/sounds/metal-whoosh.mp3";
    const soundRef = useRef<THREE.PositionalAudio | null>(null);

    const handleClick = () => {
        setCount(count + 1);
        if (count >= 7) {
            setCount(1);
            setAmount(amount-1);
        }
        if (amount <= 0) {
            const taskFinished = {
                lobbyId: lobbyId,
                playerId: myPlayerId,
                taskId: taskId
            };
            Publish("/send/taskFinished", JSON.stringify(taskFinished));
            setCurrentTask(undefined);
            setAllowedToMove(true);
        }
        if (count%8 != 1 && !soundRef.current?.isPlaying) {
            soundRef.current?.play()
        }

        const newTexturePath = "/images/chopping${count}.png";
        const newTexture = new TextureLoader().load(newTexturePath);
        newTexture.magFilter = THREE.NearestFilter;
        newTexture.minFilter = THREE.NearestFilter;
        setTexture(newTexture);

    };

    return (
        <group>
            <mesh position={new THREE.Vector3(myPlayer?.x, myPlayer?.y, 2)}
                  scale={[scale.width/(0.4270833333333333*scale.width+(-35)), scale.height/(0.004669753812365262*(scale.height**2)+(-4.846533486941553)*(scale.height)+1627.4816620249615), scale.depth]}
                  onClick={() => handleClick()}>
                <boxGeometry args={[1, 1, 0.1]} />
                <meshBasicMaterial map={texture} />
                <PositionalAudio ref={soundRef} url={audioSrc} loop={false} distance={0.1}/>
            </mesh>
            {<Text position={new THREE.Vector3(myPlayer?.x, (myPlayer?.y ?? 0) - 0.5, 3)}
                   scale={[scale.width/(12.5*scale.width+2000), scale.height/(0.026041087702004067*(scale.height**2)+(-18.48551443522764)*(scale.height)+9597.56938662081), scale.depth]} color="#ffffff">{amount} wood left to chop</Text>}
        </group>
    )
}
