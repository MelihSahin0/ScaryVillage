import React, {useEffect, useState} from "react";
import {gameState, role} from "../types";
import {
    CloseConnection,
    Publish,
    SubscribePlayers,
    UnsubscribePlayers,
    SubscribeToLobby, SubscribeVotingTime, UnsubscribeVotingTime, SubscribeGameEnd, UnsubscribeGameEnd
} from "./VoteManagerSocket";
import PlayerList from "./PlayerList";
import TextChat from "./TextChat";
import {SubscribeGetMessages, UnsubscribeGetMessages, Publish as LobbyPublish} from "../lobby/LobbyManagerSocket";

export type Player = {
    id: string;
    name: string;
    color: string;
    role: role;
    requester: boolean;
    numberOfVotes: number;
    killed: boolean;
}

export type Message = {
    wasAlive: string;
    playerName: string;
    message: string;
}

type Props = {
    myPlayerId: string;
    lobbyId: string;
    setGameState(newState: gameState): void;
    setWinner(setWinner: role): void;
}

export default function Voting({myPlayerId, lobbyId, setGameState, setWinner}: Props) {

    const [players, setPlayers] = useState<Array<Player>>([]);
    const [myPlayer, setMyPlayer] = useState<Player|undefined>();
    const [votedPlayer, setVotedPlayer] = useState("");
    const [skippedVote, setSkippedVote] = useState<number>(0)
    const [killedPlayer, setKilledPlayer] = useState("");
    const [time, setTime] = useState<number>();
    const [timeoutId, setTimeoutId] = useState<any>(); // State to hold the timeout ID
    const [messages, setMessages] = useState<Array<Message>>([])

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
                    requester: message.requester === "true",
                    numberOfVotes: parseInt(message.numberOfVotes),
                    killed: message.killed === "true"
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
        let foundKilledPlayer = false;
        
        if (time !== undefined && time === 0){
            let numberOfVotes = 0;
            players.forEach((player) => {
                if (player.killed){
                    foundKilledPlayer = true;
                    setKilledPlayer(player.name);
                    numberOfVotes = numberOfVotes + 1 - player.numberOfVotes; //He would be already dead, that is why we count it
                } else if (!foundKilledPlayer){
                    setKilledPlayer("\"nobody\"");
                }
                if(player.role === "crewmate" || player.role === "imposter"){
                    numberOfVotes = numberOfVotes + 1 - player.numberOfVotes;
                }
            });
            setSkippedVote(numberOfVotes);
        }
    }, [players, time]);

     useEffect(() => {
        const gameEnd = (messages: any) => {
            setWinner(messages.winner);
            clearTimeout(timeoutId);
            setTimeout(() => setGameState("lobby"), 10000);
        }
        SubscribeGameEnd(gameEnd);
        return () => {
            UnsubscribeGameEnd();
            clearTimeout(timeoutId);
        }
     }, []);

    useEffect(() => {
        const time = (message: any) => {
            setTime(parseInt(message.timeLeft));
           if (message.timeLeft === "0") {
              setTimeoutId(setTimeout(() => setGameState("inGame"), 10000));
           }
        };
        SubscribeVotingTime(time);
        return () => {
            UnsubscribeVotingTime();
            clearTimeout(timeoutId);
        };
    }, []);

    useEffect(() => {
        const getMessages = (messages: any) => {
            setMessages(messages)
        }
        SubscribeGetMessages(getMessages);

        return () => {
            UnsubscribeGetMessages();
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            const sendMyLobbyId = {
                lobbyId: lobbyId
            };
            Publish("/send/players",  JSON.stringify(sendMyLobbyId));
            const getMessages = {
                lobbyId: lobbyId
            }
            LobbyPublish("/send/getMessages", JSON.stringify(getMessages));
        }, 500);
        return () => {
            CloseConnection();
        }
    }, []);

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
                        time={time}
                    />
                    <div className="flex justify-center mt-5">
                        <button onClick={() => {
                                if ((myPlayer?.role === "crewmate" || myPlayer?.role === "imposter") && time !== 0) {
                                    setVotedPlayer("");

                                    const message = {
                                        "lobbyId": lobbyId,
                                        "fromPlayerId": myPlayer?.id,
                                        "toPlayerId": "",
                                    };
                                    Publish("/send/voting", JSON.stringify(message));
                                }
                            }}
                        ><p className={votedPlayer === "" && (myPlayer?.role === "crewmate" || myPlayer?.role === "imposter") ? 'text-red-500 text-xl' : 'text-white text-xl'}>
                            {time === 0 ? "Skipped votes: " + (skippedVote == 0 ? "" : skippedVote) : "Skip vote!" }
                        </p>
                        </button>
                    </div>
                </div>
                <div className="col-span-1 grid-cols-subgrid -mt-12 w-80 min-h-80 justify-center items-center flex">
                    <div className="border-white border-1 min-h-80 flex-1">
                        <TextChat lobbyId={lobbyId} myPlayerId={myPlayerId} messages={messages} players={players} myPlayer={myPlayer}/>
                    </div>
                </div>
            </div>
            <div className="flex justify-center mb-20">
                <p className="text-3xl text-white self-center">{killedPlayer !== "" ? `Player burned: ${killedPlayer}` : ''}</p>
            </div>
        </div>
    );
}