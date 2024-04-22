import * as THREE from "three";
import React, {useEffect, useState} from "react";
import {Publish, SubscribeBellCooldown, UnsubscribeBellCooldown,} from "../PlayermanagerSocket";
import {Player} from "../PlayerManager";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: Player | undefined;
}

export default function BellMesh({lobbyId, myPlayerId, myPlayer}: Props){

    const [isHovered, setIsHovered] = useState(false);
    const [bellCooldown, setBellCooldown] = useState<number>()
    
    const handlePointerOver = () => {
        setIsHovered(true);
    };

    const handlePointerOut = () => {
        setIsHovered(false);
    };

    const handleClick = () => {
        if (bellCooldown === 0) {
            const message = {
                "lobbyId": lobbyId,
                "fromPlayerId": myPlayerId,
                "toPlayerId": "emergency"
            };

            Publish("/send/report", JSON.stringify(message));
        }
    };

    useEffect(() => {
        if (myPlayer?.role === "imposter" || myPlayer?.role === "crewmate"){
            const cooldown = (message: any) => {
                console.log(parseInt(message.bellCooldown))
                setBellCooldown(parseInt(message.bellCooldown));
                console.log(bellCooldown)
            }
            SubscribeBellCooldown(cooldown);
        } else {
            setBellCooldown(100);
            UnsubscribeBellCooldown();
        }
        return () => {
            UnsubscribeBellCooldown();
        }
    }, [myPlayer]);

    return (
        <group>
            <mesh position={new THREE.Vector3(0.1, 0.2, -1)} onClick={handleClick}
                  onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
                <boxGeometry args={[0.6, 0.5, 1]}/>
                <meshBasicMaterial transparent/>
            </mesh>
            <group visible={isHovered && bellCooldown === 0 && (myPlayer?.role === "crewmate" || myPlayer?.role === "imposter")}>
                <lineSegments position={[0.1, 0.2, 1]}>
                    <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.6, 0.5, 1)]}/>
                    <lineBasicMaterial attach="material" color={0xFFFF00}/>
                </lineSegments>
            </group>
        </group>
    )
}