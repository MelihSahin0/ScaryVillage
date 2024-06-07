import { Player } from "../../PlayerManager";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { Publish } from "../../TaskmanagerSocket";
import React, {useEffect, useRef, useState} from "react";
import { Task } from "../Map";
import { Scale } from "../../InGame";
import {PositionalAudio} from "@react-three/drei";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: any;
    taskId: string;
    setCurrentTask: (setCurrentTask: Task | undefined) => void;
    setAllowedToMove: (setAllowedToMove: boolean) => void;
    scale: Scale;
    setTasks: (setTasks: any | undefined) => void;
    tasks: any | undefined;
};

export default function FountainMesh({ lobbyId, myPlayerId, myPlayer, taskId, setCurrentTask, setAllowedToMove, scale, setTasks, tasks }: Props) {
    setAllowedToMove(false);

    const textureBackground = useLoader(TextureLoader, '/images/fountain_background.png');
    const texture1 = useLoader(TextureLoader, '/images/fountain_house_burning.png');
    const texture2 = useLoader(TextureLoader, '/images/fountain_house.png');
    textureBackground.magFilter = THREE.NearestFilter;
    textureBackground.minFilter = THREE.NearestFilter;
    texture1.magFilter = THREE.NearestFilter;
    texture1.minFilter = THREE.NearestFilter;
    texture2.magFilter = THREE.NearestFilter;
    texture2.minFilter = THREE.NearestFilter;

    const initialHouseTextures = Array.from({ length: 2 }, (_, index) => index < 6 ? texture1 : texture2);
    const [houseTextures, setHouseTextures] = useState(initialHouseTextures);
    const waterSrc = "/sounds/water-splash.mp3";
    const waterRef = useRef<THREE.PositionalAudio | null>(null);


    const onClick = () => {
        const taskFinished = {
            lobbyId: lobbyId,
            playerId: myPlayerId,
            taskId: taskId
        };
        Publish("/send/sabotageDone", JSON.stringify(taskFinished));
    };

    const handleHouseClick = (index: number) => {
        waterRef.current?.play()
        setHouseTextures((prevTextures) =>
            prevTextures.map((texture, i) => (i === index ? texture2 : texture))
        );
    };

    useEffect(() => {
        if (areAllHousesAtTexture2()) {
            onClick();
        }
    }, [houseTextures]);

    const areAllHousesAtTexture2 = () => {
        return houseTextures.every((texture) => texture === texture2);
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * 9);
            setHouseTextures((prevTextures) =>
                prevTextures.map((texture, index) => (index === randomIndex ? texture1 : texture))
            );
        }, 500);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <group>
            <PositionalAudio url={"/sounds/fire-burning.mp3"} autoplay loop={true} distance={0.5}/>
            {/* Background Mesh */}
            <mesh
                position={new THREE.Vector3(myPlayer!.x, myPlayer!.y, 2)}
                scale={[scale.width / (0.4270833333333333 * scale.width + (-35)), scale.height / (0.004669753812365262 * (scale.height ** 2) + (-4.846533486941553) * scale.height + 1627.4816620249615), scale.depth]}
            >
                <boxGeometry args={[1, 1, 0.1]} />
                <PositionalAudio ref={waterRef} url={waterSrc} loop={false} distance={1}/>
                <meshBasicMaterial map={textureBackground} transparent={true} />
            </mesh>

            {/* House Meshes */}
            {[
                { position: new THREE.Vector3(myPlayer!.x-0.6, myPlayer!.y+0.2, 4) },
                { position: new THREE.Vector3(myPlayer!.x-0.3, myPlayer!.y-0.1, 4) },
                { position: new THREE.Vector3(myPlayer!.x+0.6, myPlayer!.y, 4) },
                { position: new THREE.Vector3(myPlayer!.x-0.2, myPlayer!.y-0.4, 4) },
                { position: new THREE.Vector3(myPlayer!.x, myPlayer!.y+0.3, 4) },
                { position: new THREE.Vector3(myPlayer!.x+0.4, myPlayer!.y-0.3, 4) },
                { position: new THREE.Vector3(myPlayer!.x+0.8, myPlayer!.y+0.4, 4) },
                { position: new THREE.Vector3(myPlayer!.x+0.9, myPlayer!.y-0.25, 4) },
                { position: new THREE.Vector3(myPlayer!.x-0.9, myPlayer!.y-0.3, 4) }
            ].map((meshProps, index) => (
                <mesh
                    key={index}
                    position={meshProps.position}
                    scale={[scale.width / (0.4270833333333333 * scale.width + (-35)) * 0.75, scale.height / (0.004669753812365262 * (scale.height ** 2) + (-4.846533486941553) * scale.height + 1627.4816620249615) * 0.75, scale.depth]}
                    onClick={() => handleHouseClick(index)}
                >
                    <boxGeometry args={[0.3, 0.4, 0.1]} />
                    <meshBasicMaterial map={houseTextures[index]} transparent={true} />
                </mesh>
            ))}
        </group>
    );
}
