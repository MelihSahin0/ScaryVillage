import {Player} from "../../PlayerManager";
import {Task} from "../Map";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    myPlayer: Player | undefined;
    tasks: Array<Task>
}

export default function ChoppingMesh({lobbyId, myPlayerId ,myPlayer, tasks}: Props){

}