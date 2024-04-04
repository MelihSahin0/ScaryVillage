import {gameState} from "../types";
import {Canvas} from "@react-three/fiber";
import {OrthographicCamera} from "@react-three/drei";
import React, {useEffect} from "react";
import Map from "./Map"
import {Publish, SubscribeJoinLobby, SubscribeToLobby} from "../PlayermanagerSocket";
import {Publish as PublishGameStatus} from "../GamemanagerSocket";
import {Player} from "../inGame/PlayerManager";

const colors = [
    'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'cyan', 'magenta',
    'maroon', 'navy', 'olive', 'teal', 'lime', 'aqua', 'fuchsia',
    'brown', 'pink', 'indigo',  'coral',  'violet', 'aquamarine', 'crimson', 'darkred',
    'darkgreen', 'darkblue', 'darkorange', 'darkviolet', 'darkgoldenrod', 'darkcyan',
    'darkmagenta', 'darkkhaki', 'darkslateblue', 'darkolivegreen', 'darkseagreen',
    'lightsalmon', 'lightcoral', 'lightpink', 'lightgreen', 'lightblue', 'lightcyan'
];

type Props = {
    setPlayers(newPlayers: Array<Player>): void;
    myPlayerId: string
    lobbyId: string,
    setGameState(newState: gameState): void;
};

export default function Lobby({setPlayers, myPlayerId, lobbyId, setGameState}: Props){

    useEffect(() => {
        SubscribeToLobby(lobbyId);
    }, [lobbyId]);

    useEffect(() => {
        wait(300).then(() =>{
            const joinLobby = (messages: any) => {
                const updatedPlayers: Array<Player> = [];
                messages.forEach((message: any) => {
                    const newPlayer: Player = {
                        id: message.id,
                        src: 'src/images/pixi.png',
                        color: colors[updatedPlayers.length],
                        x: message.position.x,
                        y: message.position.y,
                        z: 0.5,
                        role: message.role
                    };
                    updatedPlayers.push(newPlayer);
                });
                setPlayers(updatedPlayers)
            };
            SubscribeJoinLobby(joinLobby);
        })
    }, [lobbyId]);

    function wait(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(() => {
        wait(600).then(() => {
            const sendMyPlayerId = {
                playerId: myPlayerId,
                lobbyId: lobbyId
            };
            Publish("/send/registerPlayer", JSON.stringify(sendMyPlayerId));
        });
    }, [lobbyId]);

    return (
        <div id="canvas-container" style={{position: 'relative'}}>
            <Canvas style={{height: '100vh'}}>
                <OrthographicCamera position={[0, 0, 10]} makeDefault zoom={100}/>
                <ambientLight/>
                <pointLight position={[10, 10, 10]}/>
                <Map/>
            </Canvas>
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" >This is the lobbyId: {lobbyId}</p>
            <button
                className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-1xl text-gray-700 font-serif p-4 rounded-lg hover:bg-amber-100"
                onClick={() => {
                    const gameStatus = {
                        lobbyId: lobbyId,
                        gameStatus: "INGAME"
                    };
                    PublishGameStatus("/send/setLobbyStatus", JSON.stringify(gameStatus));

                    setGameState('inGame');
                }}
            >Start
            </button>
        </div>
    );
}