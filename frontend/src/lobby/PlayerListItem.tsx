import {Player} from "./Lobby";

type Props = {
    displayPlayer: Player;
}

export default function PlayerListItem({displayPlayer}: Props){

    return (
        <div className= "w-78 h-12 flex items-center">
            <div className={`border-${displayPlayer.color}-500 rounded-full border-8 h-7 w-7 ml-2`}/>
            <p className="text-white text-xl ml-2 rounded-full">{displayPlayer.name}</p>
        </div>
    )
}