import {Player} from "./PlayerManager";

export const calculateInsideBellDistance = (meshPosition: any, myPlayer: Player | null | undefined) => {
    if (myPlayer !== null && myPlayer !== undefined) {
        const radius = 0.6;
        const distance = Math.sqrt((meshPosition.x - myPlayer.x) ** 2 + (meshPosition.y - myPlayer.y) ** 2);
        return distance <= radius;
    }
    return false;
};

export const calculateInsideClickRange = (player: Player, myPlayer: Player | undefined ) => {
    if (myPlayer !== null && myPlayer !== undefined) {
        const radius = 0.4;
        const distance = Math.sqrt((player.x - myPlayer.x) ** 2 + (player.y - myPlayer.y) ** 2);
        return distance <= radius;
    }
    return false;
};