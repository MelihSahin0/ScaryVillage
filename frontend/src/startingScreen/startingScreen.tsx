import {gameState} from "../types";

type Props = {
    setGameState(newState: gameState): void;
};

export default function StartingScreen({ setGameState }: Props) {

    return (
        <div className="bg-gray-700 h-screen w-screen flex flex-col justify-center items-center">
            <h1 className="text-8xl text-white font-serif align-middle hover:text-amber-100">
                Scary Village
            </h1>
            <div>
                <button className="bg-white text-4xl text-gray700 font-serif m-10 w-24">Host</button>
                <button className="bg-white text-4xl text-gray700 font-serif m-10 w-24 hover:bg-amber-100" onClick={() => setGameState('lobby')}>Join</button>
            </div>
        </div>
    );
}