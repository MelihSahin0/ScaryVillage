import {Player} from "./PlayerManager";
import React, {useEffect, useRef, useState} from "react";
import {useFrame, useLoader} from "@react-three/fiber";
import {BufferGeometry, Mesh, NormalBufferAttributes, TextureLoader} from "three";
import {Publish} from "./PlayermanagerSocket";
import useKeyboard from "./KeyBoard";
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import {calculateInsideClickRange} from "./Utility";


type Props = {
    lobbyId: string;
    myPlayer: Player | undefined;
    players: Array<Player>;
    killCooldown: number;
    allowedToMove: boolean;
}

export default function DrawPlayer({lobbyId, myPlayer, players, killCooldown, allowedToMove}: Props){
    const meshRef = useRef<Mesh<BufferGeometry<NormalBufferAttributes>> | null>(null);
    const keyMap = useKeyboard();

    useFrame((_, delta) => {
        const keyPress = [];

        keyMap['KeyA'] && (keyPress.push("a"))
        keyMap['KeyD'] && (keyPress.push("d"))
        keyMap['KeyW'] && (keyPress.push("w"))
        keyMap['KeyS'] && (keyPress.push("s"))

        if (keyPress.length > 0 && allowedToMove) {
            const movementData = {
                lobbyId: lobbyId,
                playerId: myPlayer?.id,
                deltaTime: Math.round(delta * 10000) / 10000,
                movement: keyPress
            };

            Publish("/send/playerMovement", JSON.stringify(movementData));
        }
    })

    return (
        <>
            {players.map((player: Player) => (
                (
                    ((myPlayer?.role === "crewmate" || myPlayer?.role === "imposter") && (player.role === "crewmate" || player.role === "imposter" || player.role === "deadBody"))
                    ||
                    (myPlayer?.role === "imposterGhost" || myPlayer?.role === "crewmateGhost")
                )
                &&
                <DrawPlayerMesh key={player.id} lobbyId={lobbyId} player={player} myPlayer={myPlayer} meshRef={player.id === myPlayer?.id ? meshRef : undefined} killCooldown={killCooldown}/>
           ))}
        </>
    );
}


function DrawPlayerMesh({lobbyId, player, myPlayer, meshRef, killCooldown}: { lobbyId: string, player: Player, myPlayer: Player | undefined, meshRef: React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes>>> | undefined, killCooldown: number }) {
    const texture = useLoader(TextureLoader, player.src);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    const [isHovered, setIsHovered] = useState(false);
    const [insideClickRange, setInsideClickRange] = useState<boolean>()

    useEffect(() => {
        if (myPlayer !== null && myPlayer !== undefined) {
            setInsideClickRange(calculateInsideClickRange(player, myPlayer, 0.4));
        }
    }, [player.x, player.y, myPlayer?.x, myPlayer?.y]);

    const handlePointerOver = () => {
        setIsHovered(true);
    };

    const handlePointerOut = () => {
        setIsHovered(false);
        setInsideClickRange(false);
    };

    const handleClick = () => {
        const message = {
            "lobbyId": lobbyId,
            "fromPlayerId": myPlayer?.id,
            "toPlayerId": player.id.slice(0, 32)
        };

        if(player.role == "deadBody") {
            Publish("/send/report", JSON.stringify(message));
        } else {
            Publish("/send/killPlayer", JSON.stringify(message));
        }
    };

    return (
        <group>
            <Text position={[player.x, player.y + 0.25, player.z]} scale={[0.1, 0.1, 0.1]}
                  color={myPlayer?.role === "crewmate" ? "white": player.role === "imposter" ? "red" : "white"}
            >{player.name}</Text>
            <mesh ref={meshRef} position={[player.x, player.y, player.z]} onClick={handleClick}
                  onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
                <planeGeometry attach="geometry" args={[0.3, 0.3, 1]}/>
                <meshBasicMaterial transparent map={texture} color={player.color}/>
            </mesh>
            {myPlayer?.role === "imposter" && player.role === "crewmate" ? (
                <group visible={isHovered && killCooldown === 0}>
                    <lineSegments position={[player.x,player.y,player.z]}>
                        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.3, 0.3, 1)]} />
                        <lineBasicMaterial attach="material" color={insideClickRange ? 0xFF0000 : 0x808080} />
                    </lineSegments>
                </group>
            ): null}
            {(myPlayer?.role === "crewmate" || myPlayer?.role === "imposter") && player.role === "deadBody" ? (
                <group visible={isHovered}>
                    <lineSegments position={[player.x,player.y,player.z]}>
                        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.3, 0.3, 1)]} />
                        <lineBasicMaterial attach="material" color={insideClickRange ? 0xFFFF00 : 0x808080} />
                    </lineSegments>
                </group>
            ): null}
        </group>
    );
}
