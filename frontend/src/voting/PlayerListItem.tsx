import {Player} from "./Voting";
import {Publish} from "./VoteManagerSocket";

type Props = {
    displayPlayer: Player;
    lobbyId: string;
    myPlayer: Player | undefined;
    votedPlayer: string;
    setVotedPlayer(votedPlayer: string): void;
    readonly: boolean;
}

export default function PlayerListItem({displayPlayer, lobbyId, myPlayer, votedPlayer, setVotedPlayer, readonly}: Props) {

    return (
        <div className={`border-${displayPlayer.color}${displayPlayer.color !== "black" ? "-500" : ""} border-2 w-78 h-8`}>
            <label onClick={readonly ? (() => {
            }) : (() => {
                if (myPlayer !== undefined && displayPlayer.id !== myPlayer.id && (myPlayer!.role === "crewmate" || myPlayer!.role === "imposter")) {
                    setVotedPlayer(displayPlayer.id);

                    const message = {
                        "lobbyId": lobbyId,
                        "fromPlayerId": myPlayer.id,
                        "toPlayerId": displayPlayer.id,
                    };
                    Publish("/send/voting", JSON.stringify(message));
                }
            })}>
                <p className={votedPlayer === displayPlayer.id ? "float-left text-red-500 " : "float-left text-white "}>{displayPlayer.name}</p>
                {displayPlayer.requester && <img src="src/images/report.png" alt="Image" style={{ width: 'auto', height: '20px' }} className="ml-5 mt-[4px]"/>}
                <p className="float-right mr-2 text-white">{displayPlayer.numberOfVotes === 0 ? "" : displayPlayer.numberOfVotes}</p>
            </label>
        </div>
    )
}