import {OrthographicCamera} from "@react-three/drei";
import Map from "./map/Map";
import PlayerManager, {Player} from "./PlayerManager";
import {gameState, role} from "../types";
import React, {useEffect, useState} from "react";
import {useThree} from "@react-three/fiber";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    setGameState(newState: gameState): void;
    setWinner(setWinner: role): void;
}

export default function InGame({lobbyId, myPlayerId, setGameState, setWinner}: Props){

    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })


    const [myPlayer, setMyPlayer] = useState<Player>();
    const [previousX, setPreviousX] = useState(0)
    const [previousY, setPreviousY] = useState(0)

    useEffect(() => {
        if (myPlayer !== undefined){
            setPreviousX(myPlayer!.x);
            setPreviousY(myPlayer!.y);
        }

    }, [myPlayer?.x, myPlayer?.y]);

    const cameraZoomFactor: number = Math.sqrt(Math.pow(windowSize.width, 2) + Math.pow(windowSize.height, 2)) / 3.1;

    return (
        <>
            <OrthographicCamera position={[myPlayer ? myPlayer.x : previousX, myPlayer ? myPlayer.y : previousY, 10]} makeDefault zoom={cameraZoomFactor} />
            <ambientLight/>
            <pointLight position={[10, 10, 10]}/>
            <Map lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} setGameState={setGameState} setWinner={setWinner}/>
            <PlayerManager lobbyId={lobbyId} myPlayerId={myPlayerId} setGameState={setGameState} setWinner={setWinner} myPlayer={myPlayer} setMyPlayer={setMyPlayer}/>
        </>
    )
}