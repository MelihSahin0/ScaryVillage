import {Player} from "../../PlayerManager";
import {Task} from "../Map";
import {useFrame, useThree} from "@react-three/fiber";
import * as THREE from "three";
import React, {useEffect, useState} from "react";
import {Publish} from "../../TaskmanagerSocket";
import {Vector3} from "three";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: Player | undefined;
    taskId: string;
    setCurrentTask:(setCurrentTask: Task | undefined) => void;
    setAllowedToMove:(setAllowedToMove: boolean) => void;
}

export default function ChickenMesh({lobbyId, myPlayerId ,myPlayer, taskId, setCurrentTask, setAllowedToMove}: Props){
    const viewport = useThree(state => state.viewport)
    const [chickenPosition, setChickenPosition] = useState<Array<THREE.Vector3>>(
        Array.from({ length: 4 }, () => new THREE.Vector3(myPlayer!.x, myPlayer!.y, 5))
    );
    const [chickenSpeed, setChickenSpeed] = useState<number>(1)

    useFrame(() => {
        setChickenPosition(prevPositions => {
            return prevPositions.map((chickenPos, index) => {
                if (chickenPos !== null) {
                    const angle = performance.now();
                    let offsetX, offsetY;

                    if (index === 0) {
                        offsetX = Math.sin(angle / (820 / chickenSpeed)) * (0.01 * chickenSpeed);
                        offsetY = Math.sin(angle / (700 / chickenSpeed)) * (0.005 * chickenSpeed);
                    } else if (index === 1) {
                        offsetX = Math.sin(angle / (790 / chickenSpeed)) *  (0.01 * chickenSpeed);
                        offsetY = Math.cos(angle / (695 / chickenSpeed)) * (0.005 * chickenSpeed);
                    } else if (index === 2) {
                        offsetX = Math.cos(angle / (805 / chickenSpeed)) * (0.01 * chickenSpeed);
                        offsetY = Math.sin(angle / (705 / chickenSpeed)) * (0.005 * chickenSpeed);
                    } else {
                        offsetX = Math.cos(angle / (795 / chickenSpeed)) * (0.01 * chickenSpeed);
                        offsetY = Math.cos(angle / (710 / chickenSpeed)) * (0.005 * chickenSpeed);
                    }

                    const newX = chickenPos.x + offsetX;
                    const newY = chickenPos.y + offsetY;

                    const minX = myPlayer!.x - (viewport.width - viewport.width / 10) / 2.3;
                    const maxX = myPlayer!.x + (viewport.width - viewport.width / 10) / 2.2;
                    const minY = myPlayer!.y - 0.43 - (viewport.height - viewport.height / 10) / 14;
                    const maxY = myPlayer!.y - 0.43 + (viewport.height - viewport.height / 10) / 1.3;

                    const boundedX = Math.min(Math.max(newX, minX), maxX);
                    const boundedY = Math.min(Math.max(newY, minY), maxY);

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
                scale={[viewport.width - viewport.width / 10, viewport.height - viewport.height / 10, 1]}>
                <boxGeometry args={[1, 1, 0.1]}/>
                <meshBasicMaterial color={"brown"}/>
            </mesh>
            {chickenPosition.map((chickenPosi, index) => (
                <mesh key={index} position={chickenPosi}
                      scale={[viewport.width - viewport.width / 10, viewport.height - viewport.height / 10, 1]}
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
                    <sphereGeometry args={[0.05, 0.3, 0.1]} />
                    <meshStandardMaterial color="orange" />
                </mesh>
            ))}
        </group>
    )
}