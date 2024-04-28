import {OrthographicCamera} from "@react-three/drei";
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

export default function InGame({lobbyId, myPlayerId, setGameState, setWinner}: Props){
    const [myPlayer, setMyPlayer] = useState<Player>();

    const [previousX, setPreviousX] = useState(0)
    const [previousY, setPreviousY] = useState(0)
    useEffect(() => {
        if (myPlayer !== undefined){
            setPreviousX(myPlayer!.x);
            setPreviousY(myPlayer!.y);
        }

    }, [myPlayer?.x, myPlayer?.y]);

    return (
        <>
            <OrthographicCamera position={[myPlayer ? myPlayer.x : previousX, myPlayer ? myPlayer.y : previousY, 10]} makeDefault zoom={500}/>
            <ambientLight/>
            <pointLight position={[10, 10, 10]}/>
            <Map lobbyId={lobbyId} myPlayerId={myPlayerId} myPlayer={myPlayer} setGameState={setGameState} setWinner={setWinner}/>
            <PlayerManager lobbyId={lobbyId} myPlayerId={myPlayerId} setGameState={setGameState} setWinner={setWinner} myPlayer={myPlayer} setMyPlayer={setMyPlayer}/>
        </>
    )
}