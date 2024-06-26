import React, {useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {gameState, role} from "./types";
import StartingScreen from "./startingScreen/StartingScreen";
import InGame from "./inGame/InGame";
import Lobby from "./lobby/Lobby";
import {v4 as uuidv4} from "uuid";
import Voting from "./voting/Voting";
import {AdaptiveDpr} from "@react-three/drei";
import VoiceChat from "./voiceChat/voiceChatWebsocket";

const isDebug = process.env.NODE_ENV === 'development';

export default function App() {

    const [gameState, setGameState] = useState<gameState>('startingScreen');
    const [myPlayerId] = useState(uuidv4().toString().replaceAll("-",""));
    const [lobbyId, setLobbyId] = useState("");
    const [winner, setWinner] = useState<role | undefined>();
    const [masterVoiceVolume, setMasterVoiceVolume] = useState<number>(1);

    return (
        <>
            {gameState === 'startingScreen' && <StartingScreen myPlayerId={myPlayerId} setLobbyId={setLobbyId} setGameState={setGameState}/>}
            {gameState === 'lobby' && <Lobby myPlayerId={myPlayerId} lobbyId={lobbyId} setGameState={setGameState} setWinner={setWinner} winner={winner} setMasterVolume={setMasterVoiceVolume}/>}
            <Canvas style={{height: '100vh', display: gameState === 'inGame' ? 'block' : 'none'}}>
                {gameState === 'inGame' && <InGame lobbyId={lobbyId} myPlayerId={myPlayerId} setGameState={setGameState} setWinner={setWinner}/>}
                <AdaptiveDpr pixelated />
            </Canvas>
            {gameState === 'voting' && <Voting lobbyId={lobbyId} myPlayerId={myPlayerId} setGameState={setGameState} setWinner={setWinner}/>}
            {gameState !== 'startingScreen' && isDebug && <VoiceChat lobbyId={lobbyId} myPlayerId={myPlayerId} masterVolume={masterVoiceVolume}/>}
        </>
    );
}