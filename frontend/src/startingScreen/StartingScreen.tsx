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
    const [buttonMessage, setButtonMessage] = useState(false);

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
                <button className="bg-white text-4xl text-gray700 font-serif m-10 w-24 rounded-md hover:bg-amber-100"
                        onClick={() => {
                            Publish("/send/registerLobby", JSON.stringify(myPlayer))
                        }
                }>Host</button>
                <button className="bg-white text-4xl text-gray700 font-serif m-10 w-24 rounded-md hover:bg-amber-100"
                        onClick={() => {
                            if (!myPlayer.lobbyId) {
                                Publish("/send/joinLobby", JSON.stringify(myPlayer));
                            }
                        }
                }>Join</button>
            </div>
                <label className="text-white text-2xl">Join to a specific lobby with Id:</label>
            <div className="-mt-5 ml-10">
                <input className="border rounded-md text-center"
                       id="joinSpecificLobby" type="text" minLength={32} maxLength={32} size={36}
                       placeholder="Enter lobby Id"
                       onChange={(event) => {myPlayer.lobbyId = event.target.value}}
                />
                <button className="bg-white text-xl text-gray700 font-serif m-10 w-24 rounded-md hover:bg-amber-100"
                        onClick={() => {
                            if (myPlayer.lobbyId) {
                                Publish("/send/joinLobby", JSON.stringify(myPlayer));
                            } else {
                                setButtonMessage(true)
                            }
                        }
                        }>Join</button>
            </div>
                {buttonMessage && <p className="text-red-800">Please enter a lobby Id or join to a public lobby</p>}
            <p className="text-red-800">{lobbyMessage}</p>
        </div>
    );
}