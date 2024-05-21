import * as THREE from "three";
import React, {useEffect, useRef, useState} from "react";
import {useFrame, useLoader} from "@react-three/fiber";
import {TextureLoader} from "three";
import {calculateInsideClickRange} from "../../Utility";
import {Player} from "../../PlayerManager";
import {Publish} from "../../PlayermanagerSocket";
import {PositionalAudio} from "@react-three/drei";

type Props = {
    lobbyId: string;
    myPlayer: Player | undefined;
}

export default function Sewer({lobbyId, myPlayer}: Props) {

    const [isHovered, setIsHovered] = useState(false);
    const [insideSewerDistances, setInsideSewerDistances] = useState<boolean[]>([]);
    const audioSrc = "../../../public/sounds/whoosh-cinematic.mp3";
    const soundRef = useRef<THREE.PositionalAudio | null>(null);

    const texture = useLoader(TextureLoader, 'src/Images/sewer.png');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    const handlePointerOver = () => {
        setIsHovered(true);
    };

    const handlePointerOut = () => {
        setIsHovered(false);
    };

    const handleClick = (num: number) => {

        if(myPlayer?.role == "imposter") {
            soundRef.current?.play();
            const teleportData = {
                lobbyId: lobbyId,
                playerId: myPlayer?.id,
                sewerFrom: num,
                playerX: myPlayer?.x,
                playerY: myPlayer?.y
            };

            Publish("/send/playerTeleport", JSON.stringify(teleportData));
        }
    };

    const sewers = [
        {id: 0, x: -3.4, y: 1.6},
        {id: 1, x: 3, y: 1.7},
        {id: 2, x: 3.7, y: -2},
        {id: 3, x: -3.3, y: -2.1},
    ];

    useEffect(() => {
        if (myPlayer) {
            const distances = sewers.map(sewer =>
                calculateInsideClickRange(sewer, myPlayer, 0.3)
            );
            setInsideSewerDistances(distances);
        }
    }, [myPlayer?.x, myPlayer?.y]);

    return (
        <group>
            <PositionalAudio ref={soundRef} url={audioSrc} loop={false} distance={1}/>
            {sewers.map((mesh, index) => (
                <React.Fragment key={index}>
                    <mesh position={new THREE.Vector3(mesh.x, mesh.y, 0.1)} onClick={() => handleClick(mesh.id)}
                          onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
                        <boxGeometry args={[0.15, 0.15, 0.1]}/>
                        <meshBasicMaterial map={texture} transparent={true}/>
                    </mesh>
                    <group visible={isHovered && (myPlayer?.role === "imposter")}>
                        <lineSegments position={[mesh.x, mesh.y, 0.2]}>
                            <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.15, 0.15, 1)]}/>
                            <lineBasicMaterial attach="material" color={insideSewerDistances[index] ? 0xFFFF00 : 0x808080}/>
                        </lineSegments>
                    </group>
                </React.Fragment>
            ))}
        </group>
    );
}
