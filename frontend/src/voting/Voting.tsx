import {Player} from "../inGame/PlayerManager";
import {Publish, SubscribeVoting} from "../PlayermanagerSocket";
import {useEffect} from "react";

type Props = {
    myPlayerId: string
    players: any
    lobbyId: string
    setGameState: any
}

let votedPlayer = "";

let winner: string = "";

export default function Voting({myPlayerId, players, lobbyId, setGameState}: Props) {
    useEffect(() => {
        const voting = (message: any) => {
            console.log("VOTING RETURNED!!" + message.winner);
            winner = message.winner;
            setGameState('inGame');
        };
        SubscribeVoting(voting);
    },[])



    function sendVote() {
        console.log("Send Vote!");
        const message = {
            "lobbyId": lobbyId,
            "fromPlayerId": myPlayerId,
            "toPlayerId": votedPlayer
        };
        Publish("/send/voting", JSON.stringify(message));
    }

    function onVote(id: any) {
        //TODO: maybe check for own id
        votedPlayer = id;
    }

    setTimeout(sendVote, 10000);


    return (
        <div>

            <h1>Voting</h1>
            <br/>

            <ul>
                {players.map((p: Player) => (
                    <li key={p.id} onClick={() => onVote(p.id)}>{p.name}</li>
                ))}
            </ul>

            <br/>
            <button>Skip vote!</button>

            <p>{winner}</p>

        </div>
    );
}