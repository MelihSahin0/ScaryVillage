import * as THREE from 'three';
import {useLoader} from "@react-three/fiber";
import {TextureLoader} from "three";
import BellMesh from "./interactableMap/Emergency";
import {Player} from "./PlayerManager";
import {useEffect, useState} from "react";
import {Publish, SubscribePlayerTasks, SubscribeToLobby, UnsubscribePlayerTasks} from "./TaskmanagerSocket";
import BinMesh from "./interactableMap/Bin";
import {games} from "../types";
import ChickenMesh from "./interactableMap/Chicken";
import ChoppingMesh from "./interactableMap/Chopping";
import CookingMesh from "./interactableMap/Cooking";
import FishingMesh from "./interactableMap/Fishing";
import MiningMesh from "./interactableMap/Mining";
import SleepingMesh from "./interactableMap/Sleeping";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: Player | undefined;
}

export type Task = {
    taskId: string;
    gameType: games;
    targetId: number;
};

export default function Map({lobbyId, myPlayerId, myPlayer}: Props){

    const [tasks, setTasks] = useState<Array<Task>>([]);
    const texture = useLoader(TextureLoader, 'src/Images/newMap.png');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    useEffect(() => {
        SubscribeToLobby(lobbyId);
    }, [lobbyId]);

    useEffect(() => {
        const getTasks = (messages: any) => {
            if (messages[myPlayerId] != undefined){
                const updatedTasks: Array<Task> = [];
                JSON.parse(messages[myPlayerId]).forEach((message: any) => {
                    const taskJson = JSON.parse(message)
                    const task: Task = {
                        taskId: taskJson.taskId,
                        gameType: taskJson.type,
                        targetId: taskJson.targetId
                    }
                    updatedTasks.push(task);
                });
                setTasks(updatedTasks);
            }
        }
        SubscribePlayerTasks(getTasks);
        return () => {
            UnsubscribePlayerTasks();
        }
    }, [lobbyId]);

    useEffect(() => {
        setTimeout(() => {
            const sendTaskRequest = {
                lobbyId: lobbyId,
                playerId: myPlayerId
            };
            Publish("/send/tasks",  JSON.stringify(sendTaskRequest));
        }, 500);
    }, [lobbyId]);

    return (
        <group>
            <mesh position={new THREE.Vector3(0, 0, 0)}>
                <boxGeometry args={[9, 5, 0.1]}/>
                <meshBasicMaterial map={texture}/>
            </mesh>
            <BellMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer}/>
            <BinMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} tasks={tasks.filter((task) => task.gameType === "Bin")}/>
            <ChickenMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} tasks={tasks.filter((task) => task.gameType === "Chicken")}/>
            <ChoppingMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} tasks={tasks.filter((task) => task.gameType === "Chopping")}/>
            <CookingMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} tasks={tasks.filter((task) => task.gameType === "Cooking")}/>
            <FishingMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} tasks={tasks.filter((task) => task.gameType === "Fishing")}/>
            <MiningMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} tasks={tasks.filter((task) => task.gameType === "Mining")}/>
            <SleepingMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} tasks={tasks.filter((task) => task.gameType === "Sleeping")}/>
        </group>
    )
}