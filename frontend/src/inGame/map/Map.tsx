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

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: Player | undefined;
    setGameState(newState: gameState): void;
    setWinner(setWinner: role): void;
    setAllowedToMove:(setAllowedToMove: boolean) => void;
    scale: Scale;
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

export default function Map({lobbyId, myPlayerId, myPlayer, setGameState, setWinner, setAllowedToMove, scale}: Props){

    const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
    const [showMinimap, setShowMinimap] = useState<boolean>(false)
    const [progress, setProgress] = useState<number>(0)
    const [tasks, setTasks] = useState<Array<Task>>([]);
    const texture = useLoader(TextureLoader, '/images/newMap.png');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    const back = useLoader(TextureLoader, '/images/back.png');
    back.magFilter = THREE.NearestFilter;
    back.minFilter = THREE.NearestFilter;

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

    return (
        <group>
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

            {currentTask === undefined && !showMinimap &&<>
                <BellMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer}/>
                <TaskMeshDrawer lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} tasks={tasks}/>
             </>
            }

            {showMinimap ?
                <MiniMap myPlayer={myPlayer} tasks={tasks} currentTask={currentTask} scale={scale}/>
                :
                currentTask?.gameType === "Sleeping" && <SleepingMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} taskId={currentTask.taskId} setCurrentTask={setCurrentTask} setAllowedToMove={setAllowedToMove} scale={scale}/> ||
                currentTask?.gameType === "Cave" && <CaveMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} currentTask={currentTask} setCurrentTask={setCurrentTask}/> ||
                currentTask?.gameType === "Fishing" && <FishingMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} taskId={currentTask.taskId} setCurrentTask={setCurrentTask} setAllowedToMove={setAllowedToMove} scale={scale}/> ||
                currentTask?.gameType === "Chicken" && <ChickenMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} taskId={currentTask.taskId} setCurrentTask={setCurrentTask} setAllowedToMove={setAllowedToMove} scale={scale}/> ||
                currentTask?.gameType === "Cooking" && <CookingMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} taskId={currentTask.taskId} setCurrentTask={setCurrentTask} setAllowedToMove={setAllowedToMove} scale={scale}/> ||
                currentTask?.gameType === "Chopping" && <ChoppingMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} taskId={currentTask.taskId} setCurrentTask={setCurrentTask} setAllowedToMove={setAllowedToMove} scale={scale}/> ||
                currentTask?.gameType === "Mining" && <MiningMesh lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} taskId={currentTask.taskId} setCurrentTask={setCurrentTask} setAllowedToMove={setAllowedToMove} scale={scale}/>
            }
        </group>
    )
}