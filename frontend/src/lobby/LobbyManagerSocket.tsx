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
        return 'ws://localhost:8082/lobbyManagerWebsocket';
    } else {
        return 'ws://10.0.40.168:8082/lobbyManagerWebsocket';
    }
}

export function SubscribeToLobby(id: string){
    lobbyId = id;
}

export function SubscribeJoinLobby(joinLobby: (messages: any) => void){

    const messageHandler: MessageHandler = {
        id: 0,
        destination: "/subscribe/lobby/" + lobbyId,
        function: joinLobby
    };

    if (!subscriptionHandlers.find(handler => handler.id === messageHandler.id)) {
        subscriptionHandlers.push(messageHandler);
    }

    StartConnection();
}
export function UnsubscribeJoinLobby(){
    subscriptionHandlers = subscriptionHandlers.filter(handler => handler.id !== 0);
    StartConnection();
}

export function SubscribeLobbyStatus(joinLobby: (messages: any) => void){

    const messageHandler: MessageHandler = {
        id: 1,
        destination: "/subscribe/getLobbyStatus/" + lobbyId,
        function: joinLobby
    };

    if (!subscriptionHandlers.find(handler => handler.id === messageHandler.id)) {
        subscriptionHandlers.push(messageHandler);
    }

    StartConnection();
}
export function UnsubscribeLobbyStatus(){
    subscriptionHandlers = subscriptionHandlers.filter(handler => handler.id !== 1);
    StartConnection();
}

export function SubscribeGetLobbySettings(joinLobby: (messages: any) => void){

    const messageHandler: MessageHandler = {
        id: 2,
        destination: "/subscribe/lobbySettings/" + lobbyId,
        function: joinLobby
    };

    if (!subscriptionHandlers.find(handler => handler.id === messageHandler.id)) {
        subscriptionHandlers.push(messageHandler);
    }

    StartConnection();
}
export function UnsubscribeGetLobbySettings(){
    subscriptionHandlers = subscriptionHandlers.filter(handler => handler.id !== 2);
    StartConnection();
}

export function SubscribeGetMessages(joinLobby: (messages: any) => void){

    const messageHandler: MessageHandler = {
        id: 3,
        destination: "/subscribe/getMessages/" + lobbyId,
        function: joinLobby
    };

    if (!subscriptionHandlers.find(handler => handler.id === messageHandler.id)) {
        subscriptionHandlers.push(messageHandler);
    }

    StartConnection();
}
export function UnsubscribeGetMessages(){
    subscriptionHandlers = subscriptionHandlers.filter(handler => handler.id !== 3);
    StartConnection();
}

function StartConnection(){
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
    const destination : string = dest + "/" + lobbyId;
    client.publish({ destination, body });
}