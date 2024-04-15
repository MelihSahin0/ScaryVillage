import Select from "react-select";
import {Publish, SubscribeGetLobbySettings, UnsubscribeGetLobbySettings} from "./LobbyManagerSocket";
import React, {useEffect, useState} from "react";

const playerOptions = [
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: '10' }
]

const visibilityOptions = [
    {value: 0, label: 'PRIVATE'},
    {value: 1, label: 'PUBLIC'}
]

type Props = {
    lobbyId: string,
    maxNumberOfPlayers: number
}

export default function LobbySettings({lobbyId, maxNumberOfPlayers}: Props){
    const [selectedVisibility, setSelectedVisibility] = useState(visibilityOptions[0]);
    const [selectedMaxNumberOfPlayer, setSelectedMaxNumberOfPlayer] = useState(playerOptions[5]);

    useEffect(() => {
        const getSettings = (message: any) => {
            setSelectedVisibility(visibilityOptions.find((option) => option.label === message.visibility.toUpperCase())!);
            setSelectedMaxNumberOfPlayer(playerOptions.find((option) => option.label === message.maxNumberOfPlayers)!);
        }
        SubscribeGetLobbySettings(getSettings);
        return () => {
            UnsubscribeGetLobbySettings();
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            const sendMyLobbyId = {
                lobbyId: lobbyId
            };
            Publish("/send/getLobbySettings",  JSON.stringify(sendMyLobbyId));
        }, 400);
    }, [lobbyId]);

    return (
        <div className="ml-2">
            <p className="text-white mt-4 text-xl">Lobby Settings:</p>
            <div className="flex">
                <p className="w-52 pt-2 text-white">Visibility:</p>
                <Select className="-ml-8 flex rounded"
                        options={visibilityOptions}
                        value={selectedVisibility}
                        onChange={(event) => {
                            setSelectedVisibility(visibilityOptions.find((option) => option.value === event!.value)!);

                            const changeVisibility = {
                                lobbyId: lobbyId,
                                visibility: event!.value
                            }

                            Publish("/send/changeVisibility", JSON.stringify(changeVisibility));
                        }}/>
            </div>
            <div className="flex">
                <p className="w-52 pt-2 text-white">Max. number of players:</p>
                <Select className="-ml-8 flex rounded"
                        options={playerOptions}
                        value={selectedMaxNumberOfPlayer}
                        onChange={(event) => {
                            if (maxNumberOfPlayers < event!.value) {
                                setSelectedMaxNumberOfPlayer(playerOptions.find((option) => option.value === event!.value)!);

                                const setMaxPlayer = {
                                    lobbyId: lobbyId,
                                    maxNumberOfPlayers: event!.value
                                }

                                Publish("/send/setMaxNumberOfPlayers", JSON.stringify(setMaxPlayer));
                            }
                        }}/>
            </div>
        </div>
    )
}