import {Player} from "./PlayerManager";
import * as THREE from "three";
import React, {useRef, useState} from "react";
import {useFrame, useLoader} from "@react-three/fiber";
import {BufferGeometry, Mesh, NormalBufferAttributes, TextureLoader} from "three";
import {Publish} from "../PlayermanagerSocket";
import {Select} from "@react-three/postprocessing";
import useKeyboard from "./KeyBoard";

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
            {players.map((player) => (
                <DrawPlayerMesh key={player.id} lobbyId={lobbyId} player={player} curPlayer={myPlayerId} meshRef={player.id === myPlayerId ? meshRef : undefined} />
            ))}
        </>
    );
}


function DrawPlayerMesh({lobbyId, player, curPlayer, meshRef }: { lobbyId: string, player: Player, curPlayer: string, meshRef: React.Ref<Mesh> | undefined }) {
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

        Publish("/send/killPlayer", JSON.stringify(message));
    };

    return (
        <Select enabled={isHovered}>
            <mesh ref={meshRef} position={new THREE.Vector3(player.x, player.y, player.z)} onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
                <planeGeometry attach="geometry" args={[0.3, 0.3, 1]} />
                <meshBasicMaterial transparent map={texture} color={player.color}/>
            </mesh>
        </Select>
    );
}
