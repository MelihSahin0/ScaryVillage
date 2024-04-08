import {Player} from "../inGame/PlayerManager";
import {send} from "vite";
import VotingItem from "./VotingItem";
import {Publish} from "../PlayermanagerSocket";

type Props = {
    myPlayerId: string
    players: any
    lobbyId: string
    setGameState: any
}

let votedPlayer = "";



export default function Voting({myPlayerId, players, lobbyId, setGameState}: Props) {

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
                    <li onClick={() => onVote(p.id)}>{p.name}</li>
                ))}
            </ul>

            <br/>
            <button>Skip vote!</button>

        </div>
    );
}