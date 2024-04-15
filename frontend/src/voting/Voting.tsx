import {useEffect, useState} from "react";
import {gameState} from "../types";
import {
    CloseConnection,
    Publish,
    SubscribePlayers,
    SubscribeVoting, UnsubscribePlayers,
    UnsubscribeVoting,
    SubscribeToLobby
} from "./VoteManagerSocket";

export type Player = {
    id: string;
    name: string;
    color: string;
    role: string;
    host: boolean;
}

type Props = {
    myPlayerId: string
    lobbyId: string
    setGameState(newState: gameState): void;
}

export default function Voting({myPlayerId, lobbyId, setGameState}: Props) {

    const [players, setPlayers] = useState<Array<Player>>([]);
    const [myPlayer, setMyPlayer] = useState<Player|undefined>();
    const [votedPlayer, setVotedPlayer] = useState("");
    const [winner, setWinner] = useState("");

    useEffect(() => {
        SubscribeToLobby(lobbyId);
    }, []);

    useEffect(() => {
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
                console.log(newPlayer)
                if (message.id === myPlayerId){
                    setMyPlayer(newPlayer);
                }
                console.log("----------------")
                updatedPlayers.push(newPlayer);
            });
            setPlayers(updatedPlayers)
        };
        SubscribePlayers(getPlayers)
        return () => {
            UnsubscribePlayers();
        }
    },[])

    useEffect(() => {
        const voting = (message: any) => {
            const prevPlayers: Player[] = [];
            setWinner(message.name);
            players.forEach((player: Player) => {
                if (player.id === message.id) {
                    prevPlayers.push({
                        ...player,
                        color: message.color,
                        role: message.role
                    });
                } else {
                    prevPlayers.push(player);
                }
            });
            setPlayers(prevPlayers);
            setGameState("inGame");
        };
        SubscribeVoting(voting);
        return () => {
            UnsubscribeVoting();
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            const sendMyLobbyId = {
                lobbyId: lobbyId
            };
            Publish("/send/players",  JSON.stringify(sendMyLobbyId));
        }, 400);
        return () => {
            CloseConnection();
        }
    }, []);

    setTimeout(() => {
        console.log(myPlayer?.host)
        if (myPlayer?.host === true) {
            const message = {
                "endVoting": "true"
            }
            console.log(message)
            Publish("/send/voting", JSON.stringify(message));
        }
    }, 10400);

    return (
        <div className="z-50 absolute h-screen flex items-center justify-center">
            <h1>Voting</h1>
            <br/>
            <ul>
                {players.map((p: Player) => (
                    <li className={p.id === votedPlayer ? "border-2 border-red-500" : ""} key={p.id} onClick={() => {
                        if (p.id !== myPlayerId && myPlayer !== undefined && (myPlayer!.role === "CREWMATE" || myPlayer!.role === "IMPOSTERGHOST")) {
                            setVotedPlayer(p.id);
                        }
                        const message = {
                            "lobbyId": lobbyId,
                            "fromPlayerId": myPlayerId,
                            "toPlayerId": p.id
                        };
                        Publish("/send/voting", JSON.stringify(message));
                    }}>{p.name}</li>
                ))}
            </ul>
            <br/>
            <button>Skip vote!</button>
            <p>{winner}</p>
        </div>
    );
}