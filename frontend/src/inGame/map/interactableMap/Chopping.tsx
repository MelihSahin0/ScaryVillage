import { Player } from "../../PlayerManager";
import { Task } from "../Map";
import * as THREE from "three";
import React, { useState } from "react";
import { TextureLoader } from "three";
import { Publish } from "../../TaskmanagerSocket";
import {Text} from "@react-three/drei";
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
        const initialTexture = new TextureLoader().load('src/Images/Chopping1.png');
        initialTexture.magFilter = THREE.NearestFilter;
        initialTexture.minFilter = THREE.NearestFilter;
        setTexture(initialTexture);
    });

    const [count, setCount] = useState<number>(1);
    const [amount, setAmount] = useState<number>(10);


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

        const newTexturePath = `src/Images/Chopping${count}.png`;
        const newTexture = new TextureLoader().load(newTexturePath);
        newTexture.magFilter = THREE.NearestFilter;
        newTexture.minFilter = THREE.NearestFilter;
        setTexture(newTexture);

    };


    return (
        <group>
            <mesh position={new THREE.Vector3(myPlayer?.x, myPlayer?.y, 2)}
                  scale={[scale.width/580, scale.height/580, scale.depth]} onClick={() => handleClick()}>
                <boxGeometry args={[1, 1, 0.1]} />
                <meshBasicMaterial map={texture} />
            </mesh>
            {<Text position={new THREE.Vector3(myPlayer?.x, (myPlayer?.y ?? 0) - 0.5, 3)}
                   scale={[scale.width/20000, scale.height/10000, scale.depth]} color="#ffffff">{amount} wood left to chop</Text>}
        </group>
    )
}
