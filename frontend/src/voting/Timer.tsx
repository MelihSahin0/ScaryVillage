import { Publish } from "./VoteManagerSocket";
import { Player } from "./Voting";

let timerId: ReturnType<typeof setTimeout> | null = null;

type Props = {
    lobbyId: string;
    myPlayer: Player | undefined;
    setTime: (time: number) => void;
    startTime: number;
};

export function StartTimer({ lobbyId, myPlayer, setTime, startTime }: Props) {

    if (startTime !== 0) {
        timerId = setTimeout(() => {
            setTime(startTime - 1);
            StartTimer({ lobbyId, myPlayer, setTime, startTime: startTime - 1 });
        }, 1000);
    } else {
        if (timerId) {
            clearTimeout(timerId);
        }

        const message = {
            lobbyId: lobbyId,
            fromPlayerId: "",
            toPlayerId: "",
            endVoting: myPlayer?.host,
        };
        Publish("/send/voting", JSON.stringify(message));
    }
}
