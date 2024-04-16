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
    }, [lobbyId]);

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
                if (message.id === myPlayerId){
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
            setWinner(message.name);
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

    useEffect(() => {
        const endVoting = () => {
            //for some reason an if to check the host is not possible
            const message = {
                lobbyId: lobbyId,
                fromPlayerId: "",
                toPlayerId: "",
                endVoting: myPlayer?.host,
            };
            Publish("/send/voting", JSON.stringify(message));
        };
        const timeoutId = setTimeout(endVoting, 10400);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [myPlayer]);

    return (
        <div className="z-50 absolute h-screen flex items-center justify-center">
            <h1>Voting</h1>
            <br/>
            <ul>
                {players.map((p: Player) => (
                    (p.role === "CREWMATE" || p.role === "IMPOSTER") &&
                    <label key={p.id} onClick={() => {
                        if (p.id !== myPlayerId && myPlayer !== undefined && (myPlayer!.role === "CREWMATE" || myPlayer!.role === "IMPOSTER")) {
                            setVotedPlayer(p.id);

                            const message = {
                                "lobbyId": lobbyId,
                                "fromPlayerId": myPlayerId,
                                "toPlayerId": p.id,
                                "endVoting": false
                            };
                            Publish("/send/voting", JSON.stringify(message));
                        }
                    }}>
                        <li className={p.id === votedPlayer ? "border-2 border-red-500" : ""} key={p.id}>{p.name}</li>
                    </label>
                ))}
            </ul>
            <br/>
            <button className={"" === votedPlayer ? "border-2 border-red-500" : ""}>Skip vote!</button>
            <p className="text-black bg-red-500 w-52 h-52" >{winner}</p>
        </div>
    );
}