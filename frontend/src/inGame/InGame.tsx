import {OrthographicCamera, PositionalAudio} from "@react-three/drei";
import Map from "./map/Map";
import PlayerManager, {Player} from "./PlayerManager";
import {gameState, role} from "../types";
import React, {useEffect, useState} from "react";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    setGameState(newState: gameState): void;
    setWinner(setWinner: role): void;
}

export type Scale = {
    width: number,
    height: number,
    depth: number
}

export default function InGame({lobbyId, myPlayerId, setGameState, setWinner}: Props){

    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [allowedToMove, setAllowedToMove] = useState<boolean>(true);
    const [myPlayer, setMyPlayer] = useState<Player>();
    const [previousX, setPreviousX] = useState(0);
    const [previousY, setPreviousY] = useState(0);
    const [scale, setScale] = useState<Scale>({width: window.innerWidth * (window.devicePixelRatio / 2), height: window.innerHeight * (window.devicePixelRatio / 2), depth: 0.1});
    const [windowRelation, setWindowRelation] = useState<number>(Math.sqrt(Math.pow(scale.width, 2) + Math.pow(scale.height, 2)) / Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)));

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
            setScale({
                width: window.innerWidth * (window.devicePixelRatio / 2),
                height: window.innerHeight * (window.devicePixelRatio / 2),
                depth: scale.depth
            })
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [scale.depth]);

    useEffect(() => {//maybe not needed
        setWindowRelation(Math.sqrt(Math.pow(scale.width, 2) + Math.pow(scale.height, 2)) / Math.sqrt(Math.pow(windowSize.width, 2) + Math.pow(windowSize.height, 2)))
    }, [scale.height, scale.width, windowSize.height, windowSize.width]);

    useEffect(() => {
        if (myPlayer !== undefined){
            setPreviousX(myPlayer!.x);
            setPreviousY(myPlayer!.y);
        }

    }, [myPlayer?.x, myPlayer?.y]);

    const cameraZoomFactor: number = Math.sqrt(Math.pow(windowSize.width, 2) + Math.pow(windowSize.height, 2)) / (3.1);
    return (
        <>
            <OrthographicCamera position={[myPlayer ? myPlayer.x : previousX, myPlayer ? myPlayer.y : previousY, 10]} makeDefault zoom={cameraZoomFactor}/>
            <ambientLight/>
            <pointLight position={[10, 10, 10]}/>
            <PositionalAudio url={"../../../public/sounds/game-ambient-music.mp3"} autoplay loop={true} distance={0.15}/>
            <Map lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} setGameState={setGameState} setWinner={setWinner} setAllowedToMove={setAllowedToMove} scale={scale}/>
            <PlayerManager lobbyId={lobbyId} myPlayerId={myPlayerId} setGameState={setGameState} setWinner={setWinner} myPlayer={myPlayer} setMyPlayer={setMyPlayer} allowedToMove={allowedToMove}/>
        </>
    )
}