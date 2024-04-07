import {Player} from "../inGame/PlayerManager";
import Select from 'react-select'
import {Publish} from "../PlayermanagerSocket";
import {useEffect, useState} from "react";

type Props = {
    myPlayer: Player | undefined
    lobbyId: string
}

const options = [
    { value: 0, label: 'RED' },
    { value: 1, label: 'BLUE' },
    { value: 2, label: 'GREEN' },
    { value: 3, label: 'ORANGE' },
    { value: 4, label: 'PURPLE' },
    { value: 5, label: 'CYAN' },
    { value: 6, label: 'PINK' },
    { value: 7, label: 'LIME' },
    { value: 8, label: 'YELLOW' },
    { value: 9, label: 'ZINC' }
]

export default function PlayerSettings({myPlayer, lobbyId}: Props){

    const [borderColor, setBorderColor] = useState("")

    useEffect(() => {
        checkName();
    }, [myPlayer]);

    const checkName = () => {
         if (myPlayer?.name !== (document.getElementById("setPlayerName") as HTMLInputElement).value.trim()) {
             setBorderColor("border-red-500");
         } else {
             setBorderColor("");
         }
    }

    return (
        <div className="border-white border-2 min-h-80 flex-1">
            <input className={"m-1 flex justify-center items-center w-80 border-2 " + borderColor}
                   type="text" id="setPlayerName"
                   defaultValue={myPlayer === undefined ? "" : myPlayer.name}
                   onChange={(event) => {

                       const changePlayerName = {
                           playerId: myPlayer!.id,
                           lobbyId: lobbyId,
                           name: event.target.value.trim()
                       };
                       Publish("/send/changeName", JSON.stringify(changePlayerName));
                       checkName();
                   }}
            />
            <Select className="w-80 m-1 flex rounded"
                    options={options}
                    value={options.find((option) => option.label === myPlayer?.color.toUpperCase())}
                    onChange={(event) => {

                        const changePlayerColor = {
                            playerId: myPlayer!.id,
                            lobbyId: lobbyId,
                            color: event!.value
                        };
                        Publish("/send/changeColor", JSON.stringify(changePlayerColor));
                    }}/>
        </div>
    )
}