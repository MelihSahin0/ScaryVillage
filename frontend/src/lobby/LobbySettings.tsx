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
const impostorOption3 = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
]
const impostorOption2 = [
    { value: 1, label: '1' },
    { value: 2, label: '2' }
]

const impostorOption1 = [
    { value: 1, label: '1' }
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
    const [selectedImpostorOption, setSelectedImpostorOption] = useState(impostorOption1[0]);

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


    function sendImpostorValue(value: number, lobbyId: string){
        const setNumberOfImpostor = {
            lobbyId: lobbyId,
            numberOfImpostor: value
        }
        Publish("/send/setNumberOfImpostor", JSON.stringify(setNumberOfImpostor));
    }
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
                                setSelectedImpostorOption(impostorOption1[0])
                                sendImpostorValue(impostorOption1[0].value, lobbyId);
                                const setMaxPlayer = {
                                    lobbyId: lobbyId,
                                    maxNumberOfPlayers: event!.value
                                }

                                Publish("/send/setMaxNumberOfPlayers", JSON.stringify(setMaxPlayer));
                            }
                        }}/>
            </div>
            <div className="flex">
                <p className="w-52 pt-2 text-white">Number of impostor:</p>
                { selectedMaxNumberOfPlayer.value <= 5 &&
                <Select className="-ml-8 flex rounded"
                        options={impostorOption1}
                        value={selectedImpostorOption}
                        onChange={(event) => {
                                setSelectedImpostorOption(impostorOption1.find((option) => option.value === event!.value)!);
                            sendImpostorValue(event!.value, lobbyId);
                            }
                        }/>}
                { selectedMaxNumberOfPlayer.value > 5 && selectedMaxNumberOfPlayer.value < 9 &&
                    <Select className="-ml-8 flex rounded"
                            options={impostorOption2}
                            value={selectedImpostorOption}
                            onChange={(event) => {
                                setSelectedImpostorOption(impostorOption2.find((option) => option.value === event!.value)!);
                                sendImpostorValue(event!.value, lobbyId);
                            }
                            }/>}
                { selectedMaxNumberOfPlayer.value > 9 &&
                    <Select className="-ml-8 flex rounded"
                            options={impostorOption3}
                            value={selectedImpostorOption}
                            onChange={(event) => {
                                setSelectedImpostorOption(impostorOption3.find((option) => option.value === event!.value)!);
                                sendImpostorValue(event!.value, lobbyId);
                            }
                            }/>}

            </div>


        </div>
    )
}