import {Player} from "./App";
import * as THREE from "three";
import React, {useEffect, useRef} from "react";
import {useFrame, useLoader} from "@react-three/fiber";
import {Mesh, TextureLoader} from "three";

type Props = {
    myPlayer: Player;
    players: Array<Player>;
}

export default function DrawPlayer({myPlayer, players}: Props){

    //TODO
    const socket = new WebSocket("ws://localhost:8080/playerManagerWebsocket");

    socket.onopen = (event) => {
        console.log("Open");
    };

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        meshRef.current.position.x = message.position.x;
        meshRef.current.position.y = message.position.y;
    };

    const meshRef = useRef<Mesh>();
    const keyMap = useKeyboard()

    useFrame((_, delta) => {
        const keyPress = [];

        keyMap['KeyA'] && (keyPress.push("A"))
        keyMap['KeyD'] && (keyPress.push("D"))
        keyMap['KeyW'] && (keyPress.push("W"))
        keyMap['KeyS'] && (keyPress.push("S"))

        if (keyPress.length > 0) {
            const movementData = {
                id: myPlayer.id, // Assuming this is the player ID
                movement: keyPress
            };

            socket.send(JSON.stringify(movementData));
        }
    })

    return (
        <group>{
            players.map((player) => (
                    <mesh ref={myPlayer.id === player.id ? meshRef : undefined} position={new THREE.Vector3(0, 0, 0.5)}>
                        <planeGeometry args={[5, 5, 1]} />
                        <meshBasicMaterial map={useLoader(TextureLoader, player.src)} />
                    </mesh>
                )
            )
        }</group>
    )
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