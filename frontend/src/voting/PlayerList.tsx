import {Player} from "./Voting";
import PlayerListItem from "./PlayerListItem";
import React from "react";

type Props = {
    displayPlayers: Array<Player>;
    lobbyId: string;
    myPlayer: Player | undefined;
    votedPlayer: string;
    setVotedPlayer(votedPlayer: string): void ;
}

export default function PlayerList({displayPlayers, lobbyId, myPlayer, votedPlayer, setVotedPlayer}: Props){

    return (
        <div className="border-white border-2 min-h-80">
            {displayPlayers.map((player) => (
                <PlayerListItem key={player.id} displayPlayer={player} lobbyId={lobbyId}
                                myPlayer={myPlayer} votedPlayer={votedPlayer} setVotedPlayer={setVotedPlayer}
                                readonly={(player.role === "CREWMATEGHOST" || player.role === "IMPOSTERGHOST")}/>
            ))}
        </div>
    )
}