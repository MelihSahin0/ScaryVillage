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
    const [epochSeconds, setEpochSeconds] = useState(0)

    useFrame(() => {
        const keyPress = [];

        keyMap['KeyA'] && (keyPress.push("a"))
        keyMap['KeyD'] && (keyPress.push("d"))
        keyMap['KeyW'] && (keyPress.push("w"))
        keyMap['KeyS'] && (keyPress.push("s"))

        const seconds = Math.round(Date.now().valueOf() / 1000);
        if (seconds !== epochSeconds){
        setEpochSeconds(seconds)
        }

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
                (player.role === "crewmateGhost" || player.role === "imposterGhost") && player.id === myPlayerId ? <DrawPlayerMesh key={player.id} lobbyId={lobbyId} player={player} curPlayer={myPlayerId} meshRef={player.id === myPlayerId ? meshRef : undefined} counter={epochSeconds} players={players}/>
                    : player.role !== "crewmateGhost" && player.role !== "imposterGhost" && <DrawPlayerMesh key={player.id} lobbyId={lobbyId} player={player} curPlayer={myPlayerId} meshRef={player.id === myPlayerId ? meshRef : undefined} counter={epochSeconds} players={players}/>
            ))}
        </>
    );
}


function DrawPlayerMesh({lobbyId, player, curPlayer, meshRef , counter, players}: { lobbyId: string, player: Player, curPlayer: string, meshRef: React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes>>> | undefined , counter: number, players: Array<Player>}) {
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
            "fromPlayerId": curPlayer,
            "toPlayerId": player.id
        };

        if(player.role == "deadBody") {
            Publish("/send/report", JSON.stringify(message));
        } else {
            Publish("/send/killPlayer", JSON.stringify(message));
            const my = players.find(player => player.id === curPlayer);
                my!.lastKillTime = Math.round(Date.now().valueOf() / 1000);
            console.log(player.role + " killed" + player.lastKillTime)

        }
    };


    const countdown = 6 - Math.min(6, counter - player.lastKillTime);
    console.log(countdown)
    return (
        <group>
            {countdown>0 &&
            <Text position={[player.x, player.y + 0.35, player.z]} scale={[0.1, 0.1, 0.1]}>{countdown}</Text>}
            <Text position={[player.x, player.y + 0.25, player.z]} scale={[0.1, 0.1, 0.1]}>{player.name}</Text>
            <mesh ref={meshRef} position={[player.x, player.y, player.z]} onClick={handleClick}
                  onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
                <planeGeometry attach="geometry" args={[0.3, 0.3, 1]}/>
                <meshBasicMaterial transparent map={texture} color={player.color}/>
            </mesh>
            {player.id !== curPlayer && player.role !== "crewmateGhost" && player.role === "crewmate" ? (
                <group visible={isHovered}>
                    <lineSegments position={[player.x,player.y,player.z]}>
                        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.3, 0.3, 1)]} />
                        <lineBasicMaterial attach="material" color={0xff0000} />
                    </lineSegments>
                </group>
            ): null}
        </group>
    );
}
