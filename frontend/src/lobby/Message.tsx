type Props = {
    playerName: string;
    color: string | undefined;
    message: string;
    myPlayer: boolean | undefined;
}

export default function DisplayMessage({playerName, message, color, myPlayer}: Props){

    return (
        <div>
            <p className={"mr-1 ml-1 mt-1 text-" + (color !== undefined || false ? (color + "-500 ") : "white " ) + (myPlayer ? "text-right" : "text-left")}>{playerName + ":"}</p>
            <br/>
            <p className={"mr-1 ml-1 -mt-6 text-white " + (myPlayer ? "text-right" : "text-left")} style={{ overflowWrap: 'break-word' }}>{message}</p>
        </div>
    )
}