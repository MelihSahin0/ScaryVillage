import {Client} from "@stomp/stompjs";

type MessageHandler = {
    id: number;
    destination: string;
    function: (message: any) => void;
};
let subscriptionHandlers: MessageHandler[] = [];
const client = new Client();
let lobbyId = "";

const isDebug = process.env.NODE_ENV === 'development';

function getBrokerURL() {
    if (isDebug) {
        return 'ws://localhost:8083/votingManagerWebsocket';
    } else {
        return 'ws://10.0.40.168:8083/votingManagerWebsocket';
    }
}

export function SubscribeToLobby(id: string){
    lobbyId = id;
}

export function SubscribePlayers(updatePlayers: (message: any) => void) {

    const messageHandler: MessageHandler = {
        id: 0,
        destination: "/subscribe/getPlayers/" + lobbyId,
        function: updatePlayers
    };

    if (!subscriptionHandlers.find(handler => handler.id === messageHandler.id)) {
        subscriptionHandlers.push(messageHandler);
    }
}
export function UnsubscribePlayers(){
    subscriptionHandlers = subscriptionHandlers.filter(handler => handler.id !== 0);
}

export function SubscribeVoting(voting: (message: any) => void) {

    const messageHandler: MessageHandler = {
        id: 1,
        destination: "/subscribe/voting/" + lobbyId,
        function: voting
    };

    if (!subscriptionHandlers.find(handler => handler.id === messageHandler.id)) {
        subscriptionHandlers.push(messageHandler);
    }
}
export function UnsubscribeVoting(){
    subscriptionHandlers = subscriptionHandlers.filter(handler => handler.id !== 1);
}

export function SubscribeVotingTime(voting: (message: any) => void) {

    const messageHandler: MessageHandler = {
        id: 2,
        destination: "/subscribe/getVotingTime/" + lobbyId,
        function: voting
    };

    if (!subscriptionHandlers.find(handler => handler.id === messageHandler.id)) {
        subscriptionHandlers.push(messageHandler);
    }
}
export function UnsubscribeVotingTime(){
    subscriptionHandlers = subscriptionHandlers.filter(handler => handler.id !== 2);
}

export function SubscribeGameEnd(voting: (message: any) => void) {

    const messageHandler: MessageHandler = {
        id: 3,
        destination: "/subscribe/gameEnd/" + lobbyId,
        function: voting
    };

    if (!subscriptionHandlers.find(handler => handler.id === messageHandler.id)) {
        subscriptionHandlers.push(messageHandler);
    }
}
export function UnsubscribeGameEnd(){
    subscriptionHandlers = subscriptionHandlers.filter(handler => handler.id !== 3);
}

export function StartConnection(){
    client.deactivate().then();
    client.configure({
        brokerURL: getBrokerURL(),
        onConnect: () => {
            subscriptionHandlers.forEach((subscription) => {
                client.subscribe(subscription.destination, message => {
                    subscription.function(JSON.parse(message.body));
                });
            });
        }
    });
    client.activate();
}

export function CloseConnection(){
    client.deactivate().then();
}

export function Publish(dest: string, body: string){
    const destination: string = dest + "/" + lobbyId;
    client.publish({destination, body});
}