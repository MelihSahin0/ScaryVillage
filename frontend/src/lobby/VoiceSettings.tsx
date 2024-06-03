import Select from "react-select";
import React from "react";

type Props = {
    setMasterVolume(setMasterVolume: number): void;
}

const masterVolumeOptions = [
    { value: 0.0, label: '0.0' },
    { value: 0.1, label: '0.1' },
    { value: 0.2, label: '0.2' },
    { value: 0.3, label: '0.3' },
    { value: 0.4, label: '0.4' },
    { value: 0.5, label: '0.5' },
    { value: 0.6, label: '0.6' },
    { value: 0.7, label: '0.7' },
    { value: 0.8, label: '0.8' },
    { value: 0.9, label: '0.9' },
    { value: 1.0, label: '1.0' },
]

export default function VoiceSettings({setMasterVolume}: Props){

    return (
        <div className="ml-2 mt-2">
            <div className="">
                <div className="flex" >
                    <p className="w-52 pt-2 text-white mt-1">Master Volume:</p>
                    <Select className="m-2 h-7 ml-7 flex rounded w-40"
                            options={masterVolumeOptions}
                            defaultValue={masterVolumeOptions[10]}
                            onChange={(event) => {
                                if (event === null){
                                    setMasterVolume(1);
                                } else {
                                    setMasterVolume(event!.value)
                                }
                            }}/>
                </div>
            </div>
        </div>
    )
}