import {Player} from "./PlayerManager";

export const calculateInsideClickRange = (meshPosition: any, myPlayer: Player | null | undefined, radius: number) => {
    if (myPlayer !== null && myPlayer !== undefined) {
        const distance = Math.sqrt((meshPosition.x - myPlayer.x) ** 2 + (meshPosition.y - myPlayer.y) ** 2);
        return distance <= radius;
    }
    return false;
};