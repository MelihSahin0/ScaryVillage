import {Player} from "../../PlayerManager";
import {Task} from "../Map";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
import React, {useRef, useState} from "react";
import {Publish} from "../../TaskmanagerSocket";
import {TextureLoader, Vector3} from "three";
import {Scale} from "../../InGame";
import {PositionalAudio} from "@react-three/drei";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: Player | undefined;
    taskId: string;
    setCurrentTask:(setCurrentTask: Task | undefined) => void;
    setAllowedToMove:(setAllowedToMove: boolean) => void;
    scale: Scale;
}

export default function ChickenMesh({lobbyId, myPlayerId ,myPlayer, taskId, setCurrentTask, setAllowedToMove, scale}: Props){
    const [chickenPosition, setChickenPosition] = useState<Array<THREE.Vector3>>(
        Array.from({ length: 4 }, () => new THREE.Vector3(myPlayer!.x, myPlayer!.y, 5))
    );
    const [chickenSpeed, setChickenSpeed] = useState<number>(1)
    const [texture, setTexture] = useState<THREE.Texture | null>(null);
    const audioSrc = "../../../public/sounds/chicken-soundscape.mp3";
    const soundRef = useRef<THREE.PositionalAudio | null>(null);
    const audioPickSrc = "../../../public/sounds/chicken-noise.mp3";
    const soundPickRef = useRef<THREE.PositionalAudio | null>(null);

    useState(() => {
        const initialTexture = new TextureLoader().load('src/Images/chicken.png');
        initialTexture.magFilter = THREE.NearestFilter;
        initialTexture.minFilter = THREE.NearestFilter;
        setTexture(initialTexture);
    });

    useFrame((state, delta) => {
        setChickenPosition(prevPositions => {
            return prevPositions.map((chickenPos, index) => {
                if (chickenPos !== null) {
                    const angle = performance.now();
                    let offsetX, offsetY;
                    if (index === 0) {
                        offsetX = Math.sin(angle / (820 / chickenSpeed)) * (0.9 * chickenSpeed * delta);
                        offsetY = Math.sin(angle / (700 / chickenSpeed)) * (0.7 * chickenSpeed * delta);
                    } else if (index === 1) {
                        offsetX = Math.sin(angle / (790 / chickenSpeed)) *  (0.9 * chickenSpeed * delta);
                        offsetY = Math.cos(angle / (695 / chickenSpeed)) * (0.7 * chickenSpeed* delta);
                    } else if (index === 2) {
                        offsetX = Math.cos(angle / (805 / chickenSpeed)) * (0.9 * chickenSpeed * delta);
                        offsetY = Math.sin(angle / (705 / chickenSpeed)) * (0.7 * chickenSpeed * delta);
                    } else {
                        offsetX = Math.cos(angle / (795 / chickenSpeed)) * (0.9 * chickenSpeed * delta);
                        offsetY = Math.cos(angle / (710 / chickenSpeed)) * (0.7 * chickenSpeed * delta);
                    }

                    const newX =  chickenPos.x + offsetX;
                    const newY =  chickenPos.y + offsetY;

                    const deltaX = scale.width - scale.width * (9.374999999998175e-7*(scale.width)+0.9978500000000002);
                    const deltaY = scale.height - scale.height * (1.037527047480838e-8*(scale.height**2)+(-0.000010938867847488142)*(scale.height)+1.0017021724903246);
                    const minX = myPlayer!.x - deltaX;
                    const maxX = myPlayer!.x + deltaX;
                    const maxY = myPlayer!.y - deltaY;
                    const minY = myPlayer!.y + deltaY;

                    const boundedX = Math.min(Math.max(newX, minX), maxX);
                    const boundedY = Math.min(Math.max(newY, maxY), minY);

                    return new THREE.Vector3(boundedX, boundedY, chickenPos.z);
                } else {
                    return null;
                }
            }) as Vector3[];
        });
    });

    return(
        <group>
            <PositionalAudio ref={soundRef} url={audioSrc} loop={true} distance={0.5} autoplay={true} />
            <mesh position={new THREE.Vector3(myPlayer?.x, myPlayer?.y, 2)}
                  scale={[scale.width/(0.4270833333333333*scale.width+(-35)), scale.height/(0.004669753812365262*(scale.height**2)+(-4.846533486941553)*(scale.height)+1627.4816620249615), scale.depth]}>
                <boxGeometry args={[1, 1, 0.1]}/>
                <meshBasicMaterial color={"brown"}/>
            </mesh>
            {chickenPosition.map((chickenPosi, index) => (
                <mesh key={index} position={chickenPosi}
                      scale={[scale.width/(0.4270833333333333*scale.width+(-35)), scale.height/(0.004669753812365262*(scale.height**2)+(-4.846533486941553)*(scale.height)+1627.4816620249615), scale.depth]}
                      onClick={() => {

                          soundPickRef.current?.play();

                          const updatedPositions = chickenPosition.map((pos, idx) =>
                              idx === index ? null : pos
                          );
                          setChickenSpeed(1 + updatedPositions.filter(option => option === null).length / 2)
                          if (updatedPositions.every(pos => pos === null)) {
                              const taskFinished = {
                                  lobbyId: lobbyId,
                                  playerId: myPlayerId,
                                  taskId: taskId
                              };
                              Publish("/send/taskFinished", JSON.stringify(taskFinished));

                              setAllowedToMove(true);
                              setCurrentTask(undefined);
                          } else {
                              setChickenPosition(updatedPositions as any);
                          }
                      }}>
                    <boxGeometry args={[0.05, 0.08, 0.1]}/>
                    <meshBasicMaterial map={texture} transparent={true}/>
                    <PositionalAudio ref={soundPickRef} url={audioPickSrc} loop={false} distance={0.5}/>
                </mesh>
            ))}
        </group>
    )
}