import * as THREE from 'three';
import {useLoader} from "@react-three/fiber";
import {TextureLoader} from "three";
import BellMesh from "./interactableMap/Emergency";
import {Player} from "../PlayerManager";
import {useEffect, useState} from "react";
import {
    Publish, SubscribeGetPlayerTodoTask, SubscribeGetProgress,
    SubscribePlayerTasks,
    SubscribeToLobby, UnsubscribeGetPlayerTodoTask,
    UnsubscribeGetProgress,
    UnsubscribePlayerTasks
} from "../TaskmanagerSocket";
import {games, gameState, role} from "../../types";
import TaskProgress from "./TaskProgress";
import TaskMeshDrawer from "./interactableMap/TaskMeshDrawer";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: Player | undefined;
    setGameState(newState: gameState): void;
    setWinner(setWinner: role): void;
}

export type Task = {
    taskId: string;
    gameType: games;
    position: {
        x: number,
        y: number,
        z: number
    };
    scale: {
        width: number,
        height: number,
        depth: number
    };
    radius: number;
};

export default function Map({lobbyId, myPlayerId, myPlayer, setGameState, setWinner}: Props){

    {/*TODO Idea for displaying the clicked task would be this use State. And when voting this would automatically be
        undefined because it unmounts. It would be set when the backend says you were in clickRange.
     */}
    const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
    const [progress, setProgress] = useState<number>(0)
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
                        position: taskJson.position,
                        scale: taskJson.scale,
                        radius: taskJson.radius
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
        const getProgress = (message: any) => {
            setProgress(message.progress);

            if (message.progress === 1){
                setWinner("crewmate");
                setGameState("lobby");
            }
        }
        SubscribeGetProgress(getProgress);

        return () => {
            UnsubscribeGetProgress();
        }
    }, []);

    useEffect(() => {
        const getPlayerTodoTask = (message: any) => {
            if (message[myPlayerId] != undefined){
                const taskJson = message[myPlayerId];
                const task: Task = {
                    taskId: taskJson.taskId,
                    gameType: taskJson.type,
                    position: taskJson.position,
                    scale: taskJson.scale,
                    radius: taskJson.radius
                }
                setCurrentTask(task);
            }
        }
        SubscribeGetPlayerTodoTask(getPlayerTodoTask);

        return () => {
            UnsubscribeGetPlayerTodoTask();
        }
    }, []);

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
            {/*TODO When doing a task dont draw the other meshes "Disable movement?" and show task*/}
            <TaskProgress progress={progress} myPlayer={myPlayer} tasks={tasks}/>
            <BellMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer}/>
            <TaskMeshDrawer lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} tasks={tasks}/>
            {/*TODO They dont draw meshes anymore, change it so they display the game itself maybe? They need a complete Rework*/}
            {/*
            <BinMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} tasks={tasks.filter((task) => task.gameType === "Bin" || task.gameType === "Cave")}/>
            <ChickenMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} tasks={tasks.filter((task) => task.gameType === "Chicken")}/>
            <ChoppingMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} tasks={tasks.filter((task) => task.gameType === "Chopping")}/>
            <CookingMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} tasks={tasks.filter((task) => task.gameType === "Cooking")}/>
            <FishingMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} tasks={tasks.filter((task) => task.gameType === "Fishing")}/>
            <MiningMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} tasks={tasks.filter((task) => task.gameType === "Mining")}/>
            <SleepingMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} tasks={tasks.filter((task) => task.gameType === "Sleeping")}/>
            */}
        </group>
    )
}