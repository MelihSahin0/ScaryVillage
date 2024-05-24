import {Player} from "./Lobby";
import PlayerListItem from "./PlayerListItem";

type Props = {
    displayPlayers: Array<Player>;
}

export default function PlayerList({displayPlayers}: Props){

    return (
        <div className="border-white divide-y divide-gray-200 border-2 rounded-md min-h-[500px]">
            {displayPlayers.map((player) => (
                <PlayerListItem key={player.id} displayPlayer={player}/>
            ))}
        </div>
    )
}