import * as THREE from "three";
import React, {useEffect, useRef, useState} from "react";
import {Publish, SubscribeBellCooldown, UnsubscribeBellCooldown,} from "../../PlayermanagerSocket";
import {Player} from "../../PlayerManager";
import {calculateInsideClickRange} from "../../Utility";
import {PositionalAudio} from "@react-three/drei";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: Player | undefined;
    visible: boolean;
}

export default function BellMesh({lobbyId, myPlayerId, myPlayer, visible}: Props){

    const [isHovered, setIsHovered] = useState(false);
    const [bellCooldown, setBellCooldown] = useState<number>()
    const [insideBellDistance, setInsideBellDistance] = useState<boolean>();
    const meshPosition = new THREE.Vector3(0.1, 0.2, -1);
    const audioSrc = "/sounds/bell.mp3";
    const soundRef = useRef<THREE.PositionalAudio | null>(null);

    const handlePointerOver = () => {
        setIsHovered(true);
    };

    const handlePointerOut = () => {
        setIsHovered(false);
    };

    const handleClick = () => {
        if (bellCooldown === 0 && insideBellDistance) {
            soundRef.current?.play();
            setTimeout(() => {
            const message = {
                "lobbyId": lobbyId,
                "fromPlayerId": myPlayerId,
                "toPlayerId": "emergency"
            };

            Publish("/send/report", JSON.stringify(message));

            }, 1100)
        }
    };

    useEffect(() => {
        if (myPlayer?.role === "imposter" || myPlayer?.role === "crewmate"){
            const cooldown = (message: any) => {
                setBellCooldown(parseInt(message.bellCooldown));
            }
            SubscribeBellCooldown(cooldown);
        } else {
            UnsubscribeBellCooldown();
        }
        return () => {
            UnsubscribeBellCooldown();
        }
    }, [myPlayer?.role]);

    useEffect(() => {
        if (myPlayer !== null && myPlayer !== undefined) {
            setInsideBellDistance(calculateInsideClickRange(meshPosition, myPlayer, 0.6));
        }
    }, [myPlayer?.x, myPlayer?.y]);

    return (
        <group>
            {visible &&
                <group>
                    <PositionalAudio ref={soundRef} url={audioSrc} loop={false} distance={0.3}/>
                    <mesh position={meshPosition} onClick={handleClick}
                          onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
                        <boxGeometry args={[0.6, 0.5, 1]}/>
                        <meshBasicMaterial transparent/>
                    </mesh>
                    <group visible={isHovered && bellCooldown == 0 && (myPlayer?.role === "crewmate" || myPlayer?.role === "imposter")}>
                        <lineSegments position={[meshPosition.x, meshPosition.y, 1]}>
                            <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.6, 0.5, 1)]}/>
                            <lineBasicMaterial attach="material" color={insideBellDistance ? 0xFFFF00 : 0x808080 }/>
                        </lineSegments>
                    </group>
                </group>
            }
        </group>
    )
}