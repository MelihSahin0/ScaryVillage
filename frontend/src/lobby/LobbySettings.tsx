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
const imposterOption = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
]

const visibilityOptions = [
    {value: 0, label: 'PRIVATE'},
    {value: 1, label: 'PUBLIC'}
]

const cooldownOptions = [
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: '10' }
]

const timerOptions =  [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' },
    { value: 40, label: '40' },
    { value: 50, label: '50' },
    { value: 60, label: '60' }
]

type Props = {
    lobbyId: string,
    maxNumberOfPlayers: number
}

export default function LobbySettings({lobbyId, maxNumberOfPlayers}: Props){
    const [selectedVisibility, setSelectedVisibility] = useState(visibilityOptions[0]);
    const [selectedMaxNumberOfPlayer, setSelectedMaxNumberOfPlayer] = useState(playerOptions[5]);
    const [selectedImpostorOption, setSelectedImpostorOption] = useState(imposterOption[0]);
    const [selectedKillCooldown, setKillCooldown] = useState(cooldownOptions[5]);
    const [selectedBellCooldown, setBellCooldown] = useState(cooldownOptions[5]);
    const [selectedVotingTimerOptions, setVotingTimerOptions] = useState(timerOptions[5]);

    useEffect(() => {
        const getSettings = (message: any) => {
            setSelectedVisibility(visibilityOptions.find((option) => option.label === message.visibility.toUpperCase())!);
            setSelectedMaxNumberOfPlayer(playerOptions.find((option) => option.label === message.maxNumberOfPlayers)!);
            setSelectedImpostorOption(imposterOption.find((option) => option.label === message.maxImposter)!);
            setKillCooldown(cooldownOptions.find((option) => option.label === message.killCooldownTime)!);
            setBellCooldown(cooldownOptions.find((option) => option.label === message.bellCooldownTime)!);
            setVotingTimerOptions(timerOptions.find((option) => option.label === message.votingTime)!);
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

    const [checked, setChecked] = React.useState(false);

    const handleChange = () => {
        setChecked(!checked);
    };

    return (
        <div className="ml-2">
            <p className="text-white mt-4 text-xl">Lobby Settings:</p>
            <div className="overflow-auto h-32">
                <div className="flex" >
                    <p className="w-52 pt-2 text-white">Visibility:</p>
                    <Select className="m-1 h-8 flex rounded w-40"
                            options={visibilityOptions}
                            value={selectedVisibility}
                            onChange={(event) => {
                                const changeVisibility = {
                                    lobbyId: lobbyId,
                                    visibility: event!.value
                                }

                                Publish("/send/changeVisibility", JSON.stringify(changeVisibility));
                            }}/>
                </div>
                <div className="flex">
                    <label className="w-52 pt-2 text-white">Max. number of players:</label>
                    <Select maxMenuHeight={120} className="m-1 w-20 h-8 flex rounded"
                            options={playerOptions}
                            value={selectedMaxNumberOfPlayer}
                            onChange={(event) => {
                                if (maxNumberOfPlayers < event!.value) {
                                    const setMaxPlayer = {
                                        lobbyId: lobbyId,
                                        maxNumberOfPlayers: event!.value
                                    }

                                    Publish("/send/setMaxNumberOfPlayers", JSON.stringify(setMaxPlayer));
                                }
                            }}/>
                </div>
                <div className="flex">
                    <p className="w-52 pt-2 text-white">Number of imposter:</p>
                    <Select className=" m-1 w-20 h-8 flex rounded"
                            options={imposterOption.slice(
                                0,
                                selectedMaxNumberOfPlayer.value <= 5 ? 1 :
                                selectedMaxNumberOfPlayer.value <= 8 ? 2 :
                                3
                            )}
                            value={selectedImpostorOption}
                            onChange={(event) => {
                                const setNumberOfImpostor = {
                                    lobbyId: lobbyId,
                                    numberOfImpostor: event!.value
                                }
                               Publish("/send/setNumberOfImpostor", JSON.stringify(setNumberOfImpostor));
                            }
                    }/>
                </div>
                <div className="flex">
                    <p className="w-52 pt-2 text-white">Kill cooldown in sec:</p>
                    <Select  maxMenuHeight={120} className="m-1 h-8 flex rounded w-20"
                            options={cooldownOptions}
                            value={selectedKillCooldown}
                            onChange={(event) => {
                                //setKillCooldown(cooldownOptions[event!.value]);
                                const setKillCooldown = {
                                    lobbyId: lobbyId,
                                    killCooldownTime: event!.value
                                }

                                Publish("/send/setKillCooldown", JSON.stringify(setKillCooldown));
                            }}/>

                </div>
                <div className="flex">
                    <p className="w-52 pt-2 text-white">Bell cooldown in sec:</p>
                    <Select maxMenuHeight={120} className="m-1 h-8 flex rounded w-20"
                            options={cooldownOptions}
                            value={selectedBellCooldown}
                            onChange={(event) => {
                                const setBellCooldown = {
                                    lobbyId: lobbyId,
                                    bellCooldownTime: event!.value
                                }

                                Publish("/send/setBellCooldown", JSON.stringify(setBellCooldown));
                            }}/>

                </div>
                <div className="flex">
                    <p className="w-52 pt-2 text-white">Timer for voting in sec:</p>
                    <Select maxMenuHeight={120} className="m-1 h-8 flex rounded w-20"
                            options={timerOptions}
                            value={selectedVotingTimerOptions}
                            onChange={(event) => {
                                const setVotingTime = {
                                    lobbyId: lobbyId,
                                    votingTime: event!.value
                                }

                                Publish("/send/setVotingTime", JSON.stringify(setVotingTime));
                            }}/>
                </div>
                <div>
                    <label className="w-52 pt-2 text-white">
                        Kill one, if voting is draw:
                        <input className="w-20 h-4 mt-2 ml-1 mb-2"
                            type="checkbox"
                            checked={checked}
                            onChange={handleChange}
                        />
                    </label>
                </div>
        </div>
        </div>
    )
}