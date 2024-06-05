import {Player} from "../../PlayerManager";
import * as THREE from "three";
import {useLoader} from "@react-three/fiber";
import {TextureLoader} from "three";
import {Publish} from "../../TaskmanagerSocket";
import React, {useEffect, useRef, useState} from "react";
import {Task} from "../Map";
import {Scale} from "../../InGame";
import {PositionalAudio} from "@react-three/drei";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: Player | undefined;
    taskId: string;
    setCurrentTask:(setCurrentTask: Task | undefined) => void;
    setAllowedToMove:(setAllowedToMove: boolean) => void;
    scale: Scale;
}

export default function FloodingMesh({lobbyId, myPlayerId ,myPlayer, taskId, setCurrentTask, setAllowedToMove, scale}: Props){
    setAllowedToMove(false);

    const texture1 = useLoader(TextureLoader, '/images/flooding_empty.png');
    const texture2 = useLoader(TextureLoader, '/images/flooding_full.png');
    texture1.magFilter = THREE.NearestFilter;
    texture1.minFilter = THREE.NearestFilter;
    texture2.magFilter = THREE.NearestFilter;
    texture2.minFilter = THREE.NearestFilter;

    const [expansionFactor, setExpansionFactor] = useState(0.3);
    const [shovelLoaded, setShovelLoaded] = useState(false);
    const [texture, setTexture] = useState<THREE.Texture | null>(texture1);

    const textureBackground = useLoader(TextureLoader, '/images/flooding_background.png');
    textureBackground.magFilter = THREE.NearestFilter;
    textureBackground.minFilter = THREE.NearestFilter;

    const textureFlood = useLoader(TextureLoader, '/images/flooding_ocean.png');
    textureFlood.magFilter = THREE.NearestFilter;
    textureFlood.minFilter = THREE.NearestFilter;

    const texturePile = useLoader(TextureLoader, '/images/flooding_pile_of_earth.png');
    texturePile.magFilter = THREE.NearestFilter;
    texturePile.minFilter = THREE.NearestFilter;

    const shovelSrc = "/sounds/shovel.mp3";
    const floodingSrc = "/sounds/flooded.mp3";
    const shovelRef = useRef<THREE.PositionalAudio | null>(null);
    const flooding =useRef<THREE.PositionalAudio | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setExpansionFactor((prev) => prev + 0.01 <= 1 ? prev + 0.01 : prev);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const scaleX = (scale.width / (0.4270833333333333 * scale.width + -35)) * expansionFactor;
    const scaleY = scale.height / (0.004669753812365262 * (scale.height ** 2) + (-4.846533486941553) * scale.height + 1627.4816620249615);

    const emptyShovel = () => {
        if(shovelLoaded == true) {
            setExpansionFactor((prev) => Math.max(prev - 0.15, 0));
            setShovelLoaded(false);
            setTexture(texture1);
        }
        if(expansionFactor <= 0.4) {
            setAllowedToMove(true);
            const taskFinished = {
                lobbyId: lobbyId,
                playerId: myPlayerId,
                taskId: taskId
            };
            Publish("/send/sabotageDone", JSON.stringify(taskFinished));
            setCurrentTask(undefined);
        }
    };

    const loadShovel = () => {
        setShovelLoaded(true);
        setTexture(texture2);
        shovelRef.current?.play()
    }

    return(
        <group>
            <PositionalAudio ref={flooding} url={floodingSrc} autoplay loop={true} distance={0.5}/>
            <mesh position={new THREE.Vector3(myPlayer?.x, myPlayer?.y, 2)}
                  scale={[scale.width/(0.4270833333333333*scale.width+(-35)), scale.height/(0.004669753812365262*(scale.height**2)+(-4.846533486941553)*(scale.height)+1627.4816620249615), scale.depth]}>
                <boxGeometry args={[1, 1, 0.1]}/>
                <PositionalAudio ref={shovelRef} url={shovelSrc} loop={false} distance={1}/>
                <meshBasicMaterial map={textureBackground} transparent={true}/>
            </mesh>
            <mesh position={new THREE.Vector3(myPlayer?.x, myPlayer?.y, 4)}
                  scale={[scale.width/(0.4270833333333333*scale.width+(-35)), scale.height/(0.004669753812365262*(scale.height**2)+(-4.846533486941553)*(scale.height)+1627.4816620249615), scale.depth]}>
                <boxGeometry args={[0.3, 0.3, 0.1]}/>
                <meshBasicMaterial map={texture} transparent={true}/>
            </mesh>
            <mesh
                position={new THREE.Vector3(myPlayer!.x + (scaleX - scale.width / (0.4270833333333333 * scale.width + -35)) / 2, myPlayer!.y, 3)}
                scale={[scaleX, scaleY, scale.depth]}
                onClick={emptyShovel}
            >
                <boxGeometry args={[1, 1, 0.1]} />
                <meshBasicMaterial map={textureFlood} transparent={true} />
            </mesh>
            <mesh position={new THREE.Vector3(myPlayer!.x+0.9, myPlayer!.y, 4)}
                  scale={[0.6, 0.4, 0.5]}
                  onClick={loadShovel}
            >
                <boxGeometry args={[1, 1, 0.1]}/>
                <meshBasicMaterial map={texturePile} transparent={true} />
            </mesh>
        </group>
    )
}
