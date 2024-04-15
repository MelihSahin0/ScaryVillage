import {Player} from "../inGame/PlayerManager";
import {Publish, SubscribeVoting} from "../PlayermanagerSocket";
import {useEffect} from "react";

type Props = {
    myPlayerId: string
    players: any
    lobbyId: string
    setGameState: any
    setVoting: any
    setPlayers: any
}

let votedPlayer = "";

let winner: string = "";

export default function Voting({myPlayerId, players, lobbyId, setGameState, setVoting, setPlayers}: Props) {
    useEffect(() => {
        const voting = (message: any) => {
            const prevPlayers: Player[] = [];
            console.log("VOTING RETURNED!!" + message.winner);
            winner = message.winner;
            players.forEach((player: Player) => {
                if (player.id === winner) {
                    alert("AHA");
                    // TODO: Make it adjust the color... it comes into the if, but doesnt go into the push it seems
                    prevPlayers.push({
                        ...player,
                        color: 'black',
                        role: "CREWMATEGHOST"
                    });
                    console.log("DID IT WORK YET? " + player.color);
                } else {
                    prevPlayers.push(player);
                }
            });
            setPlayers(prevPlayers);
        };
        SubscribeVoting(voting);
    }, []);





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
        <div className="z-50 absolute h-screen flex items-center justify-center">

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