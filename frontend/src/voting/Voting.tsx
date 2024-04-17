import React, {useEffect, useState} from "react";
import {gameState, role} from "../types";
import {
    CloseConnection,
    Publish,
    SubscribePlayers,
    SubscribeVoting, UnsubscribePlayers,
    UnsubscribeVoting,
    SubscribeToLobby
} from "./VoteManagerSocket";
import PlayerList from "./PlayerList";
import {StartTimer} from "./Timer";

export type Player = {
    id: string;
    name: string;
    color: string;
    role: role;
    host: boolean;
}

type Props = {
    myPlayerId: string;
    lobbyId: string;
    setGameState(newState: gameState): void;
}

export default function Voting({myPlayerId, lobbyId, setGameState}: Props) {

    const [players, setPlayers] = useState<Array<Player>>([]);
    const [myPlayer, setMyPlayer] = useState<Player|undefined>();
    const [votedPlayer, setVotedPlayer] = useState("");
    const [winner, setWinner] = useState("");

    useEffect(() => {
        SubscribeToLobby(lobbyId);
    }, [lobbyId]);

    useEffect(() => {
        let myPlayerSet = false;

        const getPlayers = (messages: any) => {
            const updatedPlayers: Array<Player> = [];
            messages.forEach((message: any) => {
                const newPlayer: Player = {
                    id: message.id,
                    name: message.name,
                    color: message.color,
                    role: message.role,
                    host: message.host
                };
                if (message.id === myPlayerId && !myPlayerSet){
                    myPlayerSet = true;
                    setMyPlayer(newPlayer);
                }
                updatedPlayers.push(newPlayer);
            });
            setPlayers(updatedPlayers)
        };
        SubscribePlayers(getPlayers)
        return () => {
            UnsubscribePlayers();
        }
    },[myPlayerId])

    useEffect(() => {
        const voting = (message: any) => {
            if (message.name === ""){
                setWinner("\"nobody\"");
            } else {
                setWinner(message.name);
            }
            setTimeout(() => setGameState("inGame"), 10000)
        };
        SubscribeVoting(voting);
        return () => {
            UnsubscribeVoting();
        }
    }, [players, setGameState]);

    useEffect(() => {
        setTimeout(() => {
            const sendMyLobbyId = {
                lobbyId: lobbyId
            };
            Publish("/send/players",  JSON.stringify(sendMyLobbyId));
        }, 500);
        return () => {
            CloseConnection();
        }
    }, [lobbyId]);

    const [time, setTime] = useState(10);
    useEffect(() => {
        setTimeout(() => {
            if (myPlayer !== undefined) {
                StartTimer({lobbyId, myPlayer, setTime, startTime: time});
            }
        }, 1000);
    },[myPlayer]);

    return (
        <div className="bg-gray-700 w-screen h-screen flex flex-col justify-between items-center">
            <h1 className="text-4xl self-center pt-10 text-white">Voting</h1>
            <h1 className="text-xl self-center -mt-44 text-white">Time left to vote: {time} seconds</h1>
            <div className="grid grid-cols-2 gap-4 -mt-40 -mb-40 justify-items-center">
                <div className="col-span-1 grid-cols-subgrid w-80 min-h-80 justify-center items-center">
                    <PlayerList
                        displayPlayers={players}
                        lobbyId={lobbyId}
                        myPlayer={myPlayer}
                        votedPlayer={votedPlayer}
                        setVotedPlayer={setVotedPlayer}
                    />
                    <div className="flex justify-center mt-5">
                        <button onClick={() => {
                                if (myPlayer?.role === "crewmate" || myPlayer?.role === "imposter") {
                                    setVotedPlayer("");

                                    const message = {
                                        "lobbyId": lobbyId,
                                        "fromPlayerId": myPlayer?.id,
                                        "toPlayerId": "",
                                        "endVoting": false
                                    };
                                    Publish("/send/voting", JSON.stringify(message));
                                }
                            }}
                        ><p className={votedPlayer === "" ? 'text-red-500 text-xl' : 'text-white text-xl'}>Skip vote!</p>
                        </button>
                    </div>
                </div>
                <div className="col-span-1 grid-cols-subgrid -mt-12 w-80 min-h-82 justify-center items-center flex">
                    <div className="border-white border-2 min-h-80 flex-1">
                        <p className="text-white">Placeholder</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-center mb-20">
                <p className="text-3xl text-white self-center">{winner !== "" ? `Player burned: ${winner}` : ''}</p>
            </div>
        </div>
    );
}