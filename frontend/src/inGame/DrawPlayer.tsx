import {Player} from "./PlayerManager";
import * as THREE from "three";
import React, {useEffect, useRef, useState} from "react";
import {useFrame, useLoader} from "@react-three/fiber";
import {BufferGeometry, Mesh, NormalBufferAttributes, TextureLoader} from "three";
import {Publish} from "../SocketSubscriptions";

type Props = {
    myPlayerId: number;
    players: Array<Player>;
}

export default function DrawPlayer({myPlayerId, players}: Props){
    const meshRef = useRef<Mesh<BufferGeometry<NormalBufferAttributes>> | null>(null);

    const keyMap = useKeyboard()
    const mousePosition = useMousePosition(); // Move useMousePosition here

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
        if (mousePosition.x != null && mousePosition.y != null) {
            const message = {
                "id": myPlayerId,
                "x": mousePosition.x / 30,
                "y": mousePosition.y / 30
            };

            //Publish("/send/killPlayer", JSON.stringify(message));
            console.log(JSON.stringify(message))
            mousePosition.x = null;
            mousePosition.y = null;
        }
    })

    return (
        <>
            {players.map((player) => (
                <DrawPlayerMesh key={player.id} curPlayer={myPlayerId} player={player} meshRef={player.id === myPlayerId ? meshRef : undefined} />
            ))}
        </>
    );
}


function DrawPlayerMesh({ player, curPlayer, meshRef }: { player: Player, curPlayer: number, meshRef: React.Ref<Mesh> | undefined }) {
    const texture = useLoader(TextureLoader, player.src);

    const [isHovered, setIsHovered] = useState(false);

    const handlePointerOver = () => {
        setIsHovered(true);
    };

    const handlePointerOut = () => {
        setIsHovered(false);
    };

    const handleClick = () => {
        console.log('Player clicked:' + curPlayer + " " + player.id);

        const message = {
            "fromId": curPlayer,
            "toId": player.id
        };

        Publish("/send/killPlayer", JSON.stringify(message));
    };

    return (
        <mesh ref={meshRef} position={new THREE.Vector3(player.x, player.y, player.z)} onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
            <planeGeometry args={[0.3, 0.3, 1]} />
            <meshBasicMaterial transparent map={texture} color={isHovered ? 'red' : player.color} />
        </mesh>
    );
}

type KeyMap = {
    [key: string]: boolean;
};

function useKeyboard() {
    const keyMap = useRef<KeyMap>({})

    useEffect(() => {
        const onDocumentKey = (e: KeyboardEvent) => {
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

const useMousePosition = () => {
    const [
        mousePosition,
        setMousePosition
    ] = React.useState<{ x: number | null, y: number | null }>({ x: null, y: null });
    React.useEffect(() => {
        const updateMousePosition = (ev: MouseEvent) => {
            setMousePosition({ x: ev.clientX, y: ev.clientY });
        };
        window.addEventListener('click', updateMousePosition);
        return () => {
            window.removeEventListener('click', updateMousePosition);
        };
    }, []);
    return mousePosition;
};
