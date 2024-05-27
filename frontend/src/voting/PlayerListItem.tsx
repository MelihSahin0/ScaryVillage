import {Player} from "./Voting";
import {Publish} from "./VoteManagerSocket";

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

    return (
        <div className={`border-${displayPlayer.color}${displayPlayer.color !== "black" ? "-500" : ""} border-2 w-78 h-8`}>
            <label onClick={readonly ? (() => {
            }) : (() => {
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
                    <p className={votedPlayer === displayPlayer.id ? "text-red-500" : "text-white"}>
                        {displayPlayer.name}
                    </p>
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