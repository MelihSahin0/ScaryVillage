import {gameState} from "../types";
import React, {useEffect, useState} from "react";
import {CloseConnection, Publish, SubscribeGetLobby, UnsubscribeGetLobby} from "./GameManagerSocket";
import {StopHeartbeat} from "../lobby/Heartbeat";
import {CloseConnection as LobbyCloseConnection} from "../lobby/LobbyManagerSocket";

type Props = {
    myPlayerId: string;
    setLobbyId(lobbyId: string): void ;
    setGameState(gameState: gameState): void;
};

export default function StartingScreen({myPlayerId, setLobbyId, setGameState }: Props) {
    const [lobbyMessage, setLobbyMessage] = useState("");
    const [myPlayer] = useState({
        playerId: myPlayerId,
        lobbyId: ""
    });

    StopHeartbeat();
    LobbyCloseConnection();

    useEffect(() => {
        const getLobbyUuid = (messages: any) => {
            if (messages.playerId === myPlayer.playerId) {
                if (messages.lobbyId !== "") {
                    setLobbyId(messages.lobbyId);
                    setGameState('lobby');
                } else {
                    setLobbyMessage("Lobby does not exist or it has already started");
                }
            }
        };
        SubscribeGetLobby(getLobbyUuid);
        return () => {
            UnsubscribeGetLobby();
            CloseConnection();
        }
    }, [myPlayer.playerId, setGameState, setLobbyId]);

    return (
        <div className="bg-gray-700 h-screen w-screen flex flex-col justify-center items-center">
            <h1 className="text-8xl text-white font-serif align-middle">
                Scary Village
            </h1>
            <div>
                <button className="bg-white text-4xl text-gray700 font-serif m-10 w-24 hover:bg-amber-100"
                        onClick={() => {
                            Publish("/send/registerLobby", JSON.stringify(myPlayer))
                        }
                }>Host</button>
                <button className="bg-white text-4xl text-gray700 font-serif m-10 w-24 hover:bg-amber-100"
                        onClick={() => {
                            Publish("/send/joinLobby",JSON.stringify(myPlayer));
                        }
                }>Join</button>
            </div>
            <div className="-mt-5">
                <input className="border rounded-md text-center"
                       id="joinSpecificLobby" type="text" minLength={32} maxLength={32} size={36}
                       placeholder="Join a specefic lobby with the Looby Id"
                       onChange={(event) => {myPlayer.lobbyId = event.target.value}}
                />
            </div>
            <p className="text-red-800">{lobbyMessage}</p>
        </div>
    );
}