import {Message, Player} from "./Lobby";
import React, {useEffect, useRef, useState} from "react";
import DisplayMessage from "./Message";
import {Publish} from "./LobbyManagerSocket";

type Props = {
    lobbyId: string;
    myPlayerId: string;
    messages: Array<Message>;
    players: Array<Player>;
}

export default function TextChat({lobbyId, myPlayerId, messages, players}: Props){
    const [message, setMessage] = useState("");
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const handleSendClick = () => {
        const addMessage = {
            lobbyId: lobbyId,
            playerId: myPlayerId,
            isAlive: "true",
            message: message
        };
        Publish("/send/addMessage", JSON.stringify(addMessage));
        setMessage("");
    };

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, myPlayerId]);

    return (
        <div className="border-white rounded-md border-2 min-h-[500px] relative">
            <div className="overflow-y-auto divide-y divide-gray-200 overflow-x-hidden h-[440px]" ref={messagesContainerRef}>
                {messages.map((message, index) => {
                    const player = players.find((player) => player.name === message.playerName);

                    return <DisplayMessage key={index} playerName={message.playerName} message={message.message}
                                    color={player?.color}
                                    myPlayer={player?.id === myPlayerId}/>
                })}
            </div>
            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {e.preventDefault()}} className="absolute inset-x-0 bottom-0 mb-1">
                <input
                    id="inputTextChat"
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-[255px] h-8 ml-1 pl-1 rounded-lg"
                    placeholder=" Your message"
                    minLength={1}
                    maxLength={200}
                />
                <button
                    className="w-12 h-8 bg-white border-black border-1 rounded-lg ml-1 mr-1 items-center"
                    onClick={handleSendClick}
                >Send
                </button>
            </form>
        </div>
    )
}