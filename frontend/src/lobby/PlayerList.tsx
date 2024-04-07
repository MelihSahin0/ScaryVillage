import {Player} from "../inGame/PlayerManager";
import PlayerListItem from "./PlayerListItem";

type Props = {
    displayPlayers: Array<Player>;
}

export default function PlayerList({displayPlayers}: Props){

    return (
        <div className="border-white border-2 min-h-80">
            {displayPlayers.map((player) => (
                <PlayerListItem key={player.id} displayPlayer={player}/>
            ))}
        </div>
    )
}