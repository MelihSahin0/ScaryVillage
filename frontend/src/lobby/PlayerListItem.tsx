import {Player} from "../inGame/PlayerManager";

type Props = {
    displayPlayer: Player;
}

export default function PlayerListItem({displayPlayer}: Props){

    return (
        <div className={`border-${displayPlayer.color}-500 border-2 w-78 h-8`}>
            <p className="text-white">{displayPlayer.name}</p>
        </div>
    )
}