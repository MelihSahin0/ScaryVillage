import {Player} from "./Lobby";
import React, {useState} from "react";

type Props = {
    myPlayer: Player | undefined,
    lobbyId: string,
    onClickStart: () => void,
    onClickLeave: () => void,
    players: Player[]
}
export default function LobbyInfo({myPlayer, lobbyId, onClickStart, onClickLeave, players}: Props) {
    const [info, setInfo] = useState(false);

    return (
        <div className="flex flex-col justify-center items-center -mt-20">
            <p className="text-white pt-2">lobbyId: {lobbyId}</p>
            {info && players.length < 5 && <p className="text-red-500">Please wait until all the 5 needed players are there !</p>}
            <div className="flex">
                {myPlayer?.host && players.length >= 5 &&
                    <button className="bg-white mr-2 mb-10 mt-2 text-1xl text-gray-700 font-serif p-4 w-20 rounded-lg hover:bg-amber-100"
                        onClick={() => {
                            onClickStart()
                        }}
                    >Start
                    </button>
                }
                {myPlayer?.host && players.length < 5 &&
                    <button className="bg-gray-300 mr-2 mb-10 mt-2 text-1xl text-gray-100 font-serif p-4 w-20 rounded-lg hover:bg-amber-100"
                            onClick={() => {
                                setInfo(true);
                            }}
                    >Start
                    </button>
                }
                <button className="bg-white ml-2 mb-10 mt-2 text-1xl text-gray-700 font-serif p-4 w-20 rounded-lg hover:bg-amber-100"
                    onClick={() => {
                        onClickLeave()
                    }}
                >Leave
                </button>
            </div>
        </div>
    )
}
