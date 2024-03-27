import {Player} from "./PlayerManager";
import * as THREE from "three";
import React, {useEffect, useRef} from "react";
import {useFrame, useLoader} from "@react-three/fiber";
import {Mesh, TextureLoader} from "three";
import {Publish} from "./SocketSubscriptions";

type Props = {
    myPlayerId: number;
    players: Array<Player>;
}

export default function DrawPlayer({myPlayerId, players}: Props){
    const meshRef = useRef<Mesh>();
    const keyMap = useKeyboard()

    useFrame(() => {
        const keyPress = [];

        keyMap['KeyA'] && (keyPress.push("a"))
        keyMap['KeyD'] && (keyPress.push("d"))
        keyMap['KeyW'] && (keyPress.push("w"))
        keyMap['KeyS'] && (keyPress.push("s"))

        if (keyPress.length > 0) {
            const movementData = {
                id: myPlayerId,
                movement: keyPress
            };
            Publish("/send/playerMovement", JSON.stringify(movementData));
        }
    })

    return (
        <group>
            {players.map((player) => (
                <DrawPlayerMesh key={player.id} player={player} meshRef={player.id === myPlayerId ? meshRef : undefined} />
            ))}
        </group>
    );
}

function DrawPlayerMesh({ player, meshRef }: { player: Player, meshRef: React.Ref<Mesh> | undefined }) {
    const texture = useLoader(TextureLoader, player.src);

    return (
        <mesh ref={meshRef} position={new THREE.Vector3(player.x, player.y, player.z)}>
            <planeGeometry args={[5, 5, 1]} />
            <meshBasicMaterial transparent map={texture} />
        </mesh>
    );
}

function useKeyboard() {
    const keyMap = useRef({})

    useEffect(() => {
        const onDocumentKey = (e) => {
            keyMap.current[e.code] = e.type === 'keydown'
        }
        document.addEventListener('keydown', onDocumentKey)
        document.addEventListener('keyup', onDocumentKey)
        return () => {
            document.removeEventListener('keydown', onDocumentKey)
            document.removeEventListener('keyup', onDocumentKey)
        }
    }, [])

    return keyMap.current
}