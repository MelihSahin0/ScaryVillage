import {Player} from "../../PlayerManager";
import {Task} from "../Map";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
import React, {useState} from "react";
import {Publish} from "../../TaskmanagerSocket";
import {TextureLoader, Vector3} from "three";
import {Scale} from "../../InGame";

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

                    const minX = myPlayer!.x - (scale.width - scale.width * 0.9992);
                    const maxX = myPlayer!.x + (scale.width - scale.width * 0.9992);
                    const maxY = myPlayer!.y - (scale.height - scale.height * 0.99925);
                    const minY = myPlayer!.y + (scale.height - scale.height * 0.99922);

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
            <mesh position={new THREE.Vector3(myPlayer?.x, myPlayer?.y, 2)}
                  scale={[scale.width/(0.4270833333333333*scale.width+(-35)), scale.height/(0.004669753812365262*(scale.height**2)+(-4.846533486941553)*(scale.height)+1627.4816620249615), scale.depth]}>
                <boxGeometry args={[1, 1, 0.1]}/>
                <meshBasicMaterial color={"brown"}/>
            </mesh>
            {chickenPosition.map((chickenPosi, index) => (
                <mesh key={index} position={chickenPosi}
                      scale={[scale.width/580, scale.height/580, scale.depth]}
                      onClick={() => {
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
                </mesh>
            ))}
        </group>
    )
}