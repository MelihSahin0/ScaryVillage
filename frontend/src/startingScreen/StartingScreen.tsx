import {gameState} from "../types";
import {useEffect, useState} from "react";
import {Publish, SubscribeGetLobby} from "../GamemanagerSocket";
import { v4 as uuidv4 } from "uuid";

type Props = {
    setMyPlayerId(myPlayerId: string): void;
    setLobbyId(lobbyId: string): void ;
    setGameState(gameState: gameState): void;
};

export default function StartingScreen({setMyPlayerId, setLobbyId, setGameState }: Props) {
    const [lobbyMessage, setLobbyMessage] = useState("");

    const [myPlayer] = useState({
        playerId: uuidv4().toString().replaceAll("-",""),
    });

    useEffect(() => {
        const getLobbyUuid = (messages: any) => {
            console.log(myPlayer.playerId)
            console.log(messages)
            if (messages.playerId === myPlayer.playerId) {
                console.log(messages.playerId === myPlayer.playerId)
                if (messages.lobbyId != ""){
                    setMyPlayerId(myPlayer.playerId);
                    setLobbyId(messages.lobbyId);
                    setGameState('lobby');
                } else {
                    setLobbyMessage("Lobby does not exist or it has already started");
                }
            }
        };
        SubscribeGetLobby(getLobbyUuid);
    },[]);

    return (
        <div className="bg-gray-700 h-screen w-screen flex flex-col justify-center items-center">
            <h1 className="text-8xl text-white font-serif align-middle">
                Scary Village
            </h1>
            <div>
                <button className="bg-white text-4xl text-gray700 font-serif m-10 w-24"
                        onClick={() => {
                            Publish("/send/registerLobby", JSON.stringify(myPlayer));
                        }
                }>Host</button>
                <button className="bg-white text-4xl text-gray700 font-serif m-10 w-24 hover:bg-amber-100"
                        onClick={() => {Publish("/send/joinLobby",JSON.stringify(myPlayer))}}
                >Join</button>
            </div>
            <p className="text-red-800">{lobbyMessage}</p>
        </div>
    );
}