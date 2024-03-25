import {Player} from "./App";
import * as THREE from "three";
import React, {useEffect, useRef} from "react";
import {useFrame, useLoader} from "@react-three/fiber";
import {Mesh, TextureLoader} from "three";
import { Client } from '@stomp/stompjs';

type Props = {
    myPlayer: Player;
    players: Array<Player>;
}


export default function DrawPlayer({myPlayer, players}: Props){
    const meshRef = useRef<Mesh>();

    const client = new Client();
    client.configure({
        brokerURL: 'ws://localhost:8080/playerManagerWebsocket',
        onConnect: () => {
            client.subscribe('/topic/map', message => {
                const jsonObject = JSON.parse(JSON.parse(message.body).content);

                if (meshRef.current) {
                    meshRef.current.position.x = jsonObject.position.x;
                    meshRef.current.position.y = jsonObject.position.y;
                }
            })
        },
    });
    client.activate();

    const keyMap = useKeyboard()

    useFrame(() => {
        const keyPress = [];

        keyMap['KeyA'] && (keyPress.push("a"))
        keyMap['KeyD'] && (keyPress.push("d"))
        keyMap['KeyW'] && (keyPress.push("w"))
        keyMap['KeyS'] && (keyPress.push("s"))

        if (keyPress.length > 0) {
            const movementData = {
                id: myPlayer.id, // Assuming this is the player ID
                movement: keyPress
            };
            client.publish({destination: '/app/playermanager', body: JSON.stringify(movementData)});
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