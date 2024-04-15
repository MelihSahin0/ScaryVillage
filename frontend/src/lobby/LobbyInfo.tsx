import {Player} from "./Lobby";
import React from "react";

type Props = {
    myPlayer: Player | undefined,
    lobbyId: string,
    onClickStart: () => void,
    onClickLeave: () => void
}
export default function LobbyInfo({myPlayer, lobbyId, onClickStart, onClickLeave}: Props) {

    return (
        <div className="flex flex-col justify-center items-center -mt-16">
            <p className="text-white">lobbyId: {lobbyId}</p>
            <div className="flex">
                {myPlayer?.host &&
                    <button className="bg-white mr-2 text-1xl text-gray-700 font-serif p-4 rounded-lg hover:bg-amber-100"
                        onClick={() => {
                            onClickStart()
                        }}
                    >Start
                    </button>
                }
                <button className="bg-white ml-2 text-1xl text-gray-700 font-serif p-4 rounded-lg hover:bg-amber-100"
                    onClick={() => {
                        onClickLeave()
                    }}
                >Leave
                </button>
            </div>
        </div>
    )
}
