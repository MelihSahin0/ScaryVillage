import * as THREE from 'three';
import {useLoader} from "@react-three/fiber";
import {TextureLoader} from "three";
import BellMesh from "./interactableMap/Emergency";
import {Player} from "../PlayerManager";
import React, {useEffect, useRef, useState} from "react";
import {
    Publish, StartConnection, SubscribeGetPlayerTodoTask, SubscribeGetProgress,
    SubscribePlayerTasks, SubscribeSabotageCooldown, SubscribeSabotageDone, SubscribeSabotageTask,
    SubscribeToLobby, UnsubscribeGetPlayerTodoTask,
    UnsubscribeGetProgress,
    UnsubscribePlayerTasks, UnsubscribeSabotageCooldown, UnsubscribeSabotageDone, UnsubscribeSabotageTask
} from "../TaskmanagerSocket";
import {games, gameState, role} from "../../types";
import TaskProgress from "./TaskProgress";
import TaskMeshDrawer from "./interactableMap/TaskMeshDrawer";
import SleepingMesh from "./interactableMap/Sleeping";
import CaveMesh from "./interactableMap/Cave";
import FishingMesh from "./interactableMap/Fishing";
import ChickenMesh from "./interactableMap/Chicken";
import CookingMesh from "./interactableMap/Cooking";
import ChoppingMesh from "./interactableMap/Chopping";
import MiningMesh from "./interactableMap/Mining";
import MiniMap from "./MiniMap";
import {Scale} from "../InGame";
import Sewer from "./interactableMap/Sewer";
import Flooding from "./interactableMap/Flooding";
import FloodingMesh from "./interactableMap/FloodingTask";
import Fountain from "./interactableMap/Fountain";
import FountainMesh from "./interactableMap/FountainTask";
import {PositionalAudio} from "@react-three/drei";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: Player | undefined;
    setGameState(newState: gameState): void;
    setWinner(setWinner: role): void;
    setAllowedToMove:(setAllowedToMove: boolean) => void;
    scale: Scale;
    setSrc(pic: string): void
    setSabotageOutside(setSabotage: boolean): void;
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

export default function Map({lobbyId, myPlayerId, myPlayer, setGameState, setWinner, setAllowedToMove, scale, setSrc, setSabotageOutside}: Props){

    const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
    const [showMinimap, setShowMinimap] = useState<boolean>(false)
    const [progress, setProgress] = useState<number>(0)
    const [tasks, setTasks] = useState<Array<Task>>([]);
    const texture = useLoader(TextureLoader, '/images/newMap.png');
    const [sabotage, setSabotage] = useState<boolean>(false);
    const [sabotageCooldown, setSabotageCooldown] = useState<boolean>(false);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    const back = useLoader(TextureLoader, '/images/back.png');
    back.magFilter = THREE.NearestFilter;
    back.minFilter = THREE.NearestFilter;
    const audioSrc = "/sounds/warning.mp3";
    const warningRef = useRef<THREE.PositionalAudio | null>(null);

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
                if (task.gameType !== "Cave") {
                    setAllowedToMove(false);
                }
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
    }, [lobbyId, myPlayerId]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((currentTask === undefined || currentTask.gameType === "Cave") && (event.key === "m" || event.key === "e")) {
                if (showMinimap) {
                    setShowMinimap(false);
                } else {
                    setShowMinimap(true);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentTask, showMinimap]);

    useEffect(() => {
        const getPlayerSabotage = (message: any) => {
            if (message.type === "Flooding" || message.type === "Fountain"){
                warningRef.current?.play()
            }
            if (myPlayer?.role !== "imposterGhost" && myPlayer?.role !== "crewmateGhost") {
                if (message.type === "Flooding") {
                    const task: Task = {
                        taskId: message.taskId,
                        gameType: message.type,
                        position: message.position,
                        scale: message.scale,
                        radius: message.radius
                    }
                    setTasks([task]);
                }
                if (message.type === "Fountain") {
                    const task1: Task = {
                        taskId: "Fountain1",
                        gameType: message.type,
                        position: message.position,
                        scale: message.scale,
                        radius: message.radius
                    }
                    const task2: Task = {
                        taskId: "Fountain2",
                        gameType: message.type,
                        position: {
                            x: 0.11,
                            y: -0.95,
                            z: message.position.z
                        },
                        scale: message.scale,
                        radius: message.radius
                    }
                    setTasks([task1, task2]);
                }
                setSabotage(true);
                setSabotageOutside(true);
            }
        }
        SubscribeSabotageTask(getPlayerSabotage);
        return () => {
            UnsubscribeSabotageTask();
        }
    }, []);

    useEffect(() => {
        if (myPlayer) {
            const getPlayerSabotage = (message: any) => {
                setAllowedToMove(true);
                setCurrentTask(undefined);
                if (myPlayer.role === "imposter") {
                    setTasks([]); // set Imposter Task list empty
                } else if (message[myPlayerId] != undefined) {
                    const updatedTasks: Array<Task> = [];
                    JSON.parse(message[myPlayerId]).forEach((message: any) => {
                        const taskJson = JSON.parse(message);
                        const task: Task = {
                            taskId: taskJson.taskId,
                            gameType: taskJson.type,
                            position: taskJson.position,
                            scale: taskJson.scale,
                            radius: taskJson.radius
                        };
                        updatedTasks.push(task);
                    });
                    setTasks(updatedTasks);
                }
                setSabotage(false);
                setSabotageOutside(false);
            };
            SubscribeSabotageDone(getPlayerSabotage);
            return () => {
                UnsubscribeSabotageDone();
            };
        }
    }, [myPlayer?.role]);

    useEffect(() => {
        const getSabotageCooldown = (messages: any) => {
           if (messages.onCooldown === null){
               setWinner("imposter");
               setGameState("lobby");
           } else {
               setSabotageCooldown(messages.onCooldown);
           }
        }
        SubscribeSabotageCooldown(getSabotageCooldown);

        return () => {
            UnsubscribeSabotageCooldown();
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            StartConnection();
        }, 100)
    }, [lobbyId, myPlayerId, myPlayer?.role]);

    return (
        <group>
            <PositionalAudio ref={warningRef} url={audioSrc} loop={false} distance={0.2}/>
            <mesh position={new THREE.Vector3(0, 0, 0)}>
                <boxGeometry args={[12, 6, 0.1]} />
                <meshBasicMaterial attach="material" map={back}/>
            </mesh>
            <mesh position={new THREE.Vector3(0, 0, 0)}>
                <boxGeometry args={[9, 5, 0.1]}/>
                <meshBasicMaterial map={texture}/>
            </mesh>

            <Sewer lobbyId={lobbyId} myPlayer={myPlayer}/>
            <TaskProgress progress={progress} myPlayer={myPlayer} tasks={tasks} scale={scale}/>

            {(((myPlayer?.role === "imposter" || myPlayer?.role === "imposterGhost") && !sabotageCooldown && !tasks.some(task => task.gameType === "Fountain")) || tasks.some(task => task.gameType === "Flooding" /* Checks if the Flooding Task is set */)) && currentTask === undefined && <Flooding lobbyId={lobbyId} myPlayer={myPlayer} setCurrentTask={setCurrentTask} tasks={tasks}/>}
            {(((myPlayer?.role === "imposter" || myPlayer?.role === "imposterGhost") && !sabotageCooldown && !tasks.some(task => task.gameType === "Flooding")) || tasks.some(task => task.gameType === "Fountain" /* Checks if the Fountain Task is set */)) && currentTask === undefined && <Fountain lobbyId={lobbyId} myPlayer={myPlayer} setCurrentTask={setCurrentTask} tasks={tasks}/>}

            <BellMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} visible={currentTask === undefined && !showMinimap && !sabotage}/>
            <TaskMeshDrawer lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} tasks={tasks} setSrc={setSrc} visible={currentTask === undefined && !showMinimap && !sabotage}/>

            {showMinimap ?
                <MiniMap myPlayer={myPlayer} tasks={tasks} currentTask={currentTask} scale={scale} sabotage={sabotage}/>
                :
                currentTask?.gameType === "Sleeping" && <SleepingMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} taskId={currentTask.taskId} setCurrentTask={setCurrentTask} setAllowedToMove={setAllowedToMove} scale={scale}/> ||
                currentTask?.gameType === "Cave" && <CaveMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} currentTask={currentTask} setCurrentTask={setCurrentTask} setSrc={setSrc}/> ||
                currentTask?.gameType === "Fishing" && <FishingMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} taskId={currentTask.taskId} setCurrentTask={setCurrentTask} setAllowedToMove={setAllowedToMove} scale={scale}/> ||
                currentTask?.gameType === "Chicken" && <ChickenMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} taskId={currentTask.taskId} setCurrentTask={setCurrentTask} setAllowedToMove={setAllowedToMove} scale={scale}/> ||
                currentTask?.gameType === "Cooking" && <CookingMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} taskId={currentTask.taskId} setCurrentTask={setCurrentTask} setAllowedToMove={setAllowedToMove} scale={scale}/> ||
                currentTask?.gameType === "Chopping" && <ChoppingMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} taskId={currentTask.taskId} setCurrentTask={setCurrentTask} setAllowedToMove={setAllowedToMove} scale={scale}/> ||
                currentTask?.gameType === "Mining" && <MiningMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} taskId={currentTask.taskId} setCurrentTask={setCurrentTask} setAllowedToMove={setAllowedToMove} scale={scale}/> ||
                currentTask?.gameType === "Flooding" && <FloodingMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} taskId={currentTask.taskId} setCurrentTask={setCurrentTask} setAllowedToMove={setAllowedToMove} scale={scale}/> ||
                currentTask?.gameType === "Fountain" && <FountainMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} taskId={currentTask.taskId} setCurrentTask={setCurrentTask} setAllowedToMove={setAllowedToMove} scale={scale} setTasks={setTasks} tasks={tasks}/>
            }
        </group>
    )
}