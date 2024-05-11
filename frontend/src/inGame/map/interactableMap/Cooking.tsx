import {Player} from "../../PlayerManager";
import {Task} from "../Map";
import * as THREE from "three";
import {Publish} from "../../TaskmanagerSocket";
import React, {useEffect, useState} from "react";
import { Text } from '@react-three/drei';
import {useThree} from "@react-three/fiber";
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

type Ingredients = "Bread" | "Salad" | "Meat" | "Tomato" | "Cheese" | "Sea pimples";

export default function CookingMesh({lobbyId, myPlayerId ,myPlayer, taskId, setCurrentTask, setAllowedToMove, scale}: Props) {
    const [ingredientsPosition, setIngredientsPosition] = useState<Array<THREE.Vector3>>([
        new THREE.Vector3(myPlayer!.x -0.6, myPlayer!.y + 0.3, 5),
        new THREE.Vector3(myPlayer!.x -0.6, myPlayer!.y, 5),
        new THREE.Vector3(myPlayer!.x -0.6, myPlayer!.y - 0.3, 5),
        new THREE.Vector3(myPlayer!.x + 0.6, myPlayer!.y + 0.3, 5),
        new THREE.Vector3(myPlayer!.x + 0.6, myPlayer!.y, 5),
        new THREE.Vector3(myPlayer!.x + 0.6, myPlayer!.y - 0.3, 5),
    ]);
    const [respectiveIngredient, setRespectiveIngredient] =  useState<Array<Ingredients>>(() =>
        ["Bread", "Salad", "Meat", "Tomato", "Cheese", "Sea pimples"].sort(() => Math.random() - 0.5) as Ingredients[]
    );
    const [clickOnIngredient, setClickOnIngredient] = useState(respectiveIngredient[Math.floor(Math.random() * respectiveIngredient.length)]);

    useEffect(() => {
        if (respectiveIngredient.length !== 0) {
            setClickOnIngredient(respectiveIngredient[Math.floor(Math.random() * respectiveIngredient.length)]);
        } else {
            const taskFinished = {
                lobbyId: lobbyId,
                playerId: myPlayerId,
                taskId: taskId
            };
            Publish("/send/taskFinished", JSON.stringify(taskFinished));

            setAllowedToMove(true);
            setCurrentTask(undefined);
        }
    }, [respectiveIngredient]);

    return (
        <group>
            <mesh position={new THREE.Vector3(myPlayer?.x, myPlayer?.y, 2)}
                  scale={[scale.width/580, scale.height/580, scale.depth]}>
                <boxGeometry args={[1, 1, 0.1]}/>
                <meshBasicMaterial color={"lightgray"}/>
            </mesh>
            <Text position={new THREE.Vector3(myPlayer!.x, myPlayer!.y + 0.5, 5)}
                  scale={[0.1, 0.1, 0.1]} color={"black"}>
                  {"Use: " + clickOnIngredient}</Text>
            {ingredientsPosition.map((ingredient, index) => (
                <Text position={ingredient}
                      scale={[0.1, 0.1, 0.1]} color={"black"}
                      onClick={() => {
                        if (clickOnIngredient === respectiveIngredient[index]) {
                            setRespectiveIngredient(prevIngredients => prevIngredients.filter((_, idx) => idx !== index));
                            setIngredientsPosition(prevIngredients => prevIngredients.filter((_, idx) => idx !== index))
                        }
                      }}
                >{respectiveIngredient[index]}</Text>
            ))}
        </group>
    )
}