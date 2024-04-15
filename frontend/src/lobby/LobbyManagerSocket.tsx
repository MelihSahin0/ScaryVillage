import {Client} from "@stomp/stompjs";

type MessageHandler = {
    destination: string,
    function: (message: any) => void
};
const subscriptionHandlers: MessageHandler[] = [];
const client = new Client();
let lobbyId = "";

export function SubscribeToLobby(id: string){
    lobbyId = id;
}

export function SubscribeJoinLobby(joinLobby: (messages: any) => void){

    const messageHandler: MessageHandler = {
        destination: "/subscribe/lobby/" + lobbyId,
        function: joinLobby
    };

    if (!subscriptionHandlers.find(handler => handler.destination === messageHandler.destination)) {
        subscriptionHandlers.push(messageHandler);
    }

    Subscribe();
}

export function SubscribeLobbyStatus(joinLobby: (messages: any) => void){

    const messageHandler: MessageHandler = {
        destination: "/subscribe/getLobbyStatus/" + lobbyId,
        function: joinLobby
    };

    if (!subscriptionHandlers.find(handler => handler.destination === messageHandler.destination)) {
        subscriptionHandlers.push(messageHandler);
    }

    Subscribe();
}

export function SubscribeGetLobbySettings(joinLobby: (messages: any) => void){

    const messageHandler: MessageHandler = {
        destination: "/subscribe/lobbySettings/" + lobbyId,
        function: joinLobby
    };

    if (!subscriptionHandlers.find(handler => handler.destination === messageHandler.destination)) {
        subscriptionHandlers.push(messageHandler);
    }

    Subscribe();
}

function Subscribe(){
    client.deactivate().then();
    client.configure({
        brokerURL: 'ws://localhost:8082/lobbyManagerWebsocket',
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

export function Unsubscribe(){
    client.deactivate().then();
}

export function Publish(dest: string, body: string){
    const destination : string = dest + "/" + lobbyId;
    client.publish({ destination, body });
}