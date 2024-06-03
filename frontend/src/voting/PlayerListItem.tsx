import {Player} from "./Voting";
import {Publish} from "./VoteManagerSocket";
import React, {useRef} from "react";

type Props = {
    displayPlayer: Player;
    lobbyId: string;
    myPlayer: Player | undefined;
    votedPlayer: string;
    setVotedPlayer(votedPlayer: string): void;
    readonly: boolean;
    time: number | undefined;
}

export default function PlayerListItem({displayPlayer, lobbyId, myPlayer, votedPlayer, setVotedPlayer, readonly, time}: Props) {
    const audioRefVote = useRef<HTMLAudioElement>(null);

    return (
        <div className={`border-${displayPlayer.color}${displayPlayer.color !== "black" ? "-500" : ""} border-2 rounded-lg w-78 h-10 items-center`}>
            <audio ref={audioRefVote}>
                <source src="/sounds/click-vote.mp3" />
            </audio>
            <label onClick={readonly ? (() => {
            }) : (() => {
                if (audioRefVote.current) {
                    audioRefVote.current.volume = 0.5
                    audioRefVote.current.loop = false
                    audioRefVote.current.play()
                }
                if (myPlayer !== undefined && displayPlayer.id !== myPlayer.id && time !== undefined && time !== 0 &&
                    (myPlayer!.role === "crewmate" || myPlayer!.role === "imposter")) {
                    setVotedPlayer(displayPlayer.id);

                    const message = {
                        "lobbyId": lobbyId,
                        "fromPlayerId": myPlayer.id,
                        "toPlayerId": displayPlayer.id,
                    };
                    Publish("/send/voting", JSON.stringify(message));
                }
            })}>
                <div className="flex items-center"> {/* Container to hold the elements */}
                    <div className={`border-${displayPlayer.color}-500 rounded-full border-8 h-7 w-7 ml-2 mt-1`}/>
                    <p className={votedPlayer === displayPlayer.id ? "text-red-500" : "text-white"}>
                        {displayPlayer.name}
                    </p>
                    {votedPlayer === displayPlayer.id && <img
                        src="../../public/images/down.png"
                        alt="Image"
                        style={{width: 'auto', height: '23px'}}
                        className="pl-1 pt-[5px]"
                    />}
                    {displayPlayer.requester && (
                        <img
                            src="/images/report.png"
                            alt="Image"
                            style={{width: 'auto', height: '20px'}}
                            className="pl-1 pt-[4px]"
                        />
                    )}
                    <p className="ml-auto mr-2 text-white ">
                        {displayPlayer.numberOfVotes === 0 ? "" : displayPlayer.numberOfVotes}
                    </p>
                </div>
            </label>
        </div>
    )
}