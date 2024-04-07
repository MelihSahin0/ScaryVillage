import {gameState, colors} from "../types";
import React, {useEffect, useState} from "react";
import {Publish, SubscribeJoinLobby, SubscribeToLobby} from "../PlayermanagerSocket";
import {Publish as PublishGameStatus} from "../GamemanagerSocket";
import {Player} from "../inGame/PlayerManager";
import PlayerList from "./PlayerList";
import PlayerSettings from "./PlayerSettings";

type Props = {
    setPlayers(newPlayers: Array<Player>): void;
    myPlayerId: string
    lobbyId: string,
    setGameState(newState: gameState): void;
};

export default function Lobby({setPlayers, myPlayerId, lobbyId, setGameState}: Props){

    const [displayPlayers, setDisplayPlayers] = useState<Array<Player>>([]);
    const [myPlayer, setMyPlayer] = useState<Player | undefined>();

    useEffect(() => {
        SubscribeToLobby(lobbyId);
    }, [lobbyId]);

    useEffect(() => {
        wait(300).then(() =>{
            const joinLobby = (messages: any) => {
                const updatedPlayers: Array<Player> = [];
                messages.forEach((message: any) => {
                    const newPlayer: Player = {
                        id: message.id,
                        src: 'src/images/pixi.png',
                        name: message.name,
                        color: message.color,
                        x: message.position.x,
                        y: message.position.y,
                        z: 0.5,
                        role: message.role
                    };
                    updatedPlayers.push(newPlayer);

                    if (newPlayer.id === myPlayerId){
                        setMyPlayer(newPlayer);
                    }
                });
                setDisplayPlayers(updatedPlayers)
            };
            SubscribeJoinLobby(joinLobby);
        })
    }, [lobbyId]);

    function wait(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(() => {
        wait(600).then(() => {
            const sendMyPlayerId = {
                playerId: myPlayerId,
                lobbyId: lobbyId
            };
            Publish("/send/registerPlayer", JSON.stringify(sendMyPlayerId));
        });
    }, [lobbyId]);

    return (
        <div className="bg-gray-700 w-screen h-screen" >
            <div className="grid grid-cols-2 gap-4 pt-24 pb-40 justify-items-center">
                <div className="col-span-1 grid-cols-subgrid w-80 min-h-80 justify-center items-center">
                    <PlayerList displayPlayers={displayPlayers}/>
                </div>
                <div className="col-span-1 grid-cols-subgrid w-80 min-h-82 justify-center items-center flex">
                    <PlayerSettings myPlayer={myPlayer} lobbyId={lobbyId}/>
                </div>
            </div>
            <p className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                lobbyId: {lobbyId}</p>
            <button
                className="absolute bottom-16 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-1xl text-gray-700 font-serif p-4 rounded-lg hover:bg-amber-100"
                onClick={() => {
                    const gameStatus = {
                        lobbyId: lobbyId,
                        gameStatus: "INGAME"
                    };
                    PublishGameStatus("/send/setLobbyStatus", JSON.stringify(gameStatus));
                    setPlayers(displayPlayers);
                    setGameState('inGame');
                }}
            >Start
            </button>
        </div>
    );
}