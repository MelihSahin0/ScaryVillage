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
    { value: 1, label: '01' },
    { value: 2, label: '02' },
    { value: 3, label: '03' },
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

    const [killOneChecked, setKillOneChecked] = useState(false);
    const [votingNumberHidden, setVotingNumberHidden] = useState(false);


    return (
        <div className="ml-2 mt-2">
            <div className="">
                <div className="flex" >
                    <p className="w-52 pt-2 text-white mt-1">Visibility:</p>
                    <Select className="m-2 h-7 ml-7 flex rounded w-40"
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
                    <label className="w-52 pt-2 text-white mt-1">Max. number of players:</label>
                    <Select maxMenuHeight={120} className="m-2 w-20 h-7 flex rounded absolute inset-y-0 right-0"
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
                    <p className="w-52 pt-2 text-white mt-1">Number of imposter:</p>
                    <Select className=" m-2 w-20 h-7 flex rounded"
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
                    <p className="w-52 pt-2 text-white mt-1">Kill cooldown in sec:</p>
                    <Select maxMenuHeight={120} className="m-2 h-7 flex rounded w-20"
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
                    <p className="w-52 pt-2 text-white mt-1">Bell cooldown in sec:</p>
                    <Select maxMenuHeight={120} className="m-2 h-7 flex rounded w-20"
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
                    <p className="w-52 pt-2 text-white mt-1">Timer for voting in sec:</p>
                    <Select maxMenuHeight={120} className="m-2 h-7 flex rounded w-20"
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
                <div className="mt-1">
                    <label className="w-52 text-white">
                        Kill one, if voting is draw:
                        <input className="w-20 h-4 pt-5 ml-2 mt-2"
                            type="checkbox"
                            checked={killOneChecked}
                            onChange={()=> {
                                setKillOneChecked(!killOneChecked);
                                const checkKillOne = {
                                lobbyId: lobbyId,
                                    killOne: !killOneChecked}

                                Publish("/send/setKillOne", JSON.stringify(checkKillOne));
                        }}
                        />
                    </label>
                </div>
                <div className="mt-1">
                    <label className="w-52 text-white">
                        Voting result hidden:
                        <input className="w-20 h-4 ml-[37px]"
                               type="checkbox"
                               checked={votingNumberHidden}
                               onChange={()=> {
                                   setVotingNumberHidden(!votingNumberHidden)
                                   const checkVotingNumber = {
                                       lobbyId: lobbyId,
                                       changeVotingNumberVisibility: !votingNumberHidden}

                                   Publish("/send/changeVotingNumberVisibility", JSON.stringify(checkVotingNumber));

                               }}
                        />
                    </label>
                </div>
        </div>
        </div>
    )
}