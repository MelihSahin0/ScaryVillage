import {Player} from "./PlayerManager";
import React, {useRef, useState} from "react";
import {useFrame, useLoader} from "@react-three/fiber";
import {BufferGeometry, Mesh, NormalBufferAttributes, TextureLoader} from "three";
import {Publish} from "./PlayermanagerSocket";
import useKeyboard from "./KeyBoard";
import { Text } from '@react-three/drei';
import * as THREE from 'three';


type Props = {
    lobbyId: string,
    myPlayerId: string,
    players: Array<Player>
}

export default function DrawPlayer({lobbyId, myPlayerId, players}: Props){
    const meshRef = useRef<Mesh<BufferGeometry<NormalBufferAttributes>> | null>(null);
    const keyMap = useKeyboard();

    useFrame(() => {
        const keyPress = [];

        keyMap['KeyA'] && (keyPress.push("a"))
        keyMap['KeyD'] && (keyPress.push("d"))
        keyMap['KeyW'] && (keyPress.push("w"))
        keyMap['KeyS'] && (keyPress.push("s"))

        if (keyPress.length > 0) {
            const movementData = {
                lobbyId: lobbyId,
                playerId: myPlayerId,
                movement: keyPress
            };
            Publish("/send/playerMovement", JSON.stringify(movementData));
        }
    })

    return (
        <>
            {players.map((player: Player) => (
                (player.role === "crewmateGhost" || player.role === "imposterGhost") && player.id === myPlayerId ? <DrawPlayerMesh key={player.id} lobbyId={lobbyId} player={player} myPlayer={players.find((intern) => intern.id === myPlayerId)!} meshRef={player.id === myPlayerId ? meshRef : undefined}/>
                    : player.role !== "crewmateGhost" && player.role !== "imposterGhost" && <DrawPlayerMesh key={player.id} lobbyId={lobbyId} player={player} myPlayer={players.find((intern) => intern.id === myPlayerId)!} meshRef={player.id === myPlayerId ? meshRef : undefined}/>
            ))}
        </>
    );
}


function DrawPlayerMesh({lobbyId, player, myPlayer, meshRef }: { lobbyId: string, player: Player, myPlayer: Player, meshRef: React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes>>> | undefined }) {
    const texture = useLoader(TextureLoader, player.src);
    const [isHovered, setIsHovered] = useState(false);

    const handlePointerOver = () => {
        setIsHovered(true);
    };

    const handlePointerOut = () => {
        setIsHovered(false);
    };

    const handleClick = () => {
        const message = {
            "lobbyId": lobbyId,
            "fromPlayerId": myPlayer.id,
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
                  color={myPlayer.role === "crewmate" ? "white": player.role === "imposter" ? "red" : "white"}
            >{player.name}</Text>
            <mesh ref={meshRef} position={[player.x, player.y, player.z]} onClick={handleClick}
                  onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
                <planeGeometry attach="geometry" args={[0.3, 0.3, 1]}/>
                <meshBasicMaterial transparent map={texture} color={player.color}/>
            </mesh>
            {myPlayer.role === "imposter" && player.role === "crewmate" ? (
                <group visible={isHovered}>
                    <lineSegments position={[player.x,player.y,player.z]}>
                        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.3, 0.3, 1)]} />
                        <lineBasicMaterial attach="material" color={0xFF0000} />
                    </lineSegments>
                </group>
            ): null}
            {(myPlayer.role === "crewmate" || myPlayer.role === "imposter") && player.role === "deadBody" ? (
                <group visible={isHovered}>
                    <lineSegments position={[player.x,player.y,player.z]}>
                        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.3, 0.3, 1)]} />
                        <lineBasicMaterial attach="material" color={0xFFFF00} />
                    </lineSegments>
                </group>
            ): null}
        </group>
    );
}
