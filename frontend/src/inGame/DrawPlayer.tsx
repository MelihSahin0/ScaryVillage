import {Player} from "./PlayerManager";
import React, {useEffect, useRef, useState} from "react";
import {useFrame, useLoader} from "@react-three/fiber";
import {BufferGeometry, Mesh, NormalBufferAttributes, TextureLoader} from "three";
import {Publish} from "./PlayermanagerSocket";
import useKeyboard from "./KeyBoard";
import {PositionalAudio, Text} from '@react-three/drei';
import * as THREE from 'three';
import {calculateInsideClickRange} from "./Utility";


type Props = {
    lobbyId: string;
    myPlayer: Player | undefined;
    players: Array<Player>;
    killCooldown: number;
    allowedToMove: boolean;
    playSound: boolean;
}


export default function DrawPlayer({lobbyId, myPlayer, players, killCooldown, allowedToMove, playSound}: Props){
    const meshRef = useRef<Mesh<BufferGeometry<NormalBufferAttributes>> | null>(null);
    const keyMap = useKeyboard();
    const steps = "../../../public/sounds/knock.mp3";
    const soundRef = useRef<THREE.PositionalAudio | null>(null);
    const collision = "../../../public/sounds/jug-pop.mp3";
    const collisionRef = useRef<THREE.PositionalAudio | null>(null);
    const ghostSrc = "../../../public/sounds/whoosh.mp3";
    const ghostRef = useRef<THREE.PositionalAudio | null>(null);


    useFrame((_, delta) => {
        const keyPress = [];

        keyMap['KeyA'] && (keyPress.push("a"))
        keyMap['KeyD'] && (keyPress.push("d"))
        keyMap['KeyW'] && (keyPress.push("w"))
        keyMap['KeyS'] && (keyPress.push("s"))

        if (keyPress.length > 0 && allowedToMove) {

            if ((myPlayer?.role === "crewmate" || myPlayer?.role === "imposter") && playSound && !soundRef.current?.isPlaying){
                soundRef.current?.play();
            }
            if ((myPlayer?.role === "crewmateGhost" || myPlayer?.role === "imposterGhost") && playSound && !ghostRef.current?.isPlaying){
                ghostRef.current?.play();
            }
            if ((myPlayer?.role === "crewmate" || myPlayer?.role === "imposter") && !playSound && !collisionRef.current?.isPlaying){
                collisionRef.current?.play();
            }

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
            <PositionalAudio ref={soundRef}  distance={0.05} url= {steps} loop = {false} />
            <PositionalAudio ref={collisionRef}  distance={0.4} url= {collision} loop = {false} />
            <PositionalAudio ref={ghostRef}  distance={0.07} url= {ghostSrc} loop = {false} />
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
    const killSound = "../../../public/sounds/ambient-metal-whoosh.mp3";
    const killRef = useRef<THREE.PositionalAudio | null>(null);
    const reportSound = "../../../public/sounds/bell.mp3";
    const reportRef = useRef<THREE.PositionalAudio | null>(null);


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
            {myPlayer?.role === "imposter" && <PositionalAudio ref={killRef} distance={0.5} url= {killSound} loop = {false} />}
            {myPlayer?.role === "crewmate" && <PositionalAudio ref={reportRef} distance={0.5} url = {reportSound} loop = {false}/>}
            <mesh ref={meshRef} position={[player.x, player.y, player.z]} onClick={()=>{
                if (myPlayer?.role === "imposter" && myPlayer?.id != player.id.slice(0, 32)) {
                    killRef.current?.play();
                }
                if (myPlayer?.role === "crewmate" && myPlayer?.id != player.id.slice(0, 32)) {
                    reportRef.current?.play();
                }
                setTimeout(() => {
                    handleClick()
                }, 1000);}}
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
