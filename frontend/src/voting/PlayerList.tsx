import {Player} from "./Voting";
import PlayerListItem from "./PlayerListItem";
import React from "react";

type Props = {
    displayPlayers: Array<Player>;
    lobbyId: string;
    myPlayer: Player | undefined;
    votedPlayer: string;
    setVotedPlayer(votedPlayer: string): void ;
    time: number | undefined;
}

export default function PlayerList({displayPlayers, lobbyId, myPlayer, votedPlayer, setVotedPlayer, time}: Props){

    return (
        <div className="border-white border-2 min-h-80">
            {displayPlayers.map((player) => (
                <PlayerListItem key={player.id} displayPlayer={player} lobbyId={lobbyId}
                                myPlayer={myPlayer} votedPlayer={votedPlayer} setVotedPlayer={setVotedPlayer}
                                readonly={(player.role === "crewmateGhost" || player.role === "imposterGhost")}
                                time={time}/>
            ))}
        </div>
    )
}