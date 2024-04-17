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
                if (myPlayer !== undefined && displayPlayer.id !== myPlayer.id && (myPlayer!.role === "CREWMATE" || myPlayer!.role === "IMPOSTER")) {
                    setVotedPlayer(displayPlayer.id);

                    const message = {
                        "lobbyId": lobbyId,
                        "fromPlayerId": myPlayer.id,
                        "toPlayerId": displayPlayer.id,
                        "endVoting": false
                    };
                    Publish("/send/voting", JSON.stringify(message));
                }
            })}>
                <p className={votedPlayer === displayPlayer.id ? "text-red-500" : "text-white"}>{displayPlayer.name}</p>
            </label>
        </div>
    )
}