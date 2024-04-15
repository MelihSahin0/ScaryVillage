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

export function SubscribePlayers(updatePlayers: (message: any) => void) {

    const messageHandler: MessageHandler = {
        destination: "/subscribe/getPlayers/" + lobbyId,
        function: updatePlayers
    };

    if (!subscriptionHandlers.find(handler => handler.destination === messageHandler.destination)) {
        subscriptionHandlers.push(messageHandler);
    }

    Subscribe();
}

export function SubscribePlayerMovement(updatePlayers: (message: any) => void) {

    const messageHandler: MessageHandler = {
        destination: "/subscribe/playerPosition/" + lobbyId,
        function: updatePlayers
    };

    if (!subscriptionHandlers.find(handler => handler.destination === messageHandler.destination)) {
        subscriptionHandlers.push(messageHandler);
    }

    Subscribe();
}

export function SubscribeKill(killPlayers: (message: any) => void) {

    const messageHandler: MessageHandler = {
        destination: "/subscribe/kill/" + lobbyId,
        function: killPlayers
    };

    if (!subscriptionHandlers.find(handler => handler.destination === messageHandler.destination)) {
        subscriptionHandlers.push(messageHandler);
    }

    Subscribe();
}

export function SubscribeReport(report: (message: any) => void) {

    const messageHandler: MessageHandler = {
        destination: "/subscribe/report/" + lobbyId,
        function: report
    };

    if (!subscriptionHandlers.find(handler => handler.destination === messageHandler.destination)) {
        subscriptionHandlers.push(messageHandler);
    }

    Subscribe();
}

export function SubscribeVoting(voting: (message: any) => void) {

    const messageHandler: MessageHandler = {
        destination: "/subscribe/voting/" + lobbyId,
        function: voting
    };

    if (!subscriptionHandlers.find(handler => handler.destination === messageHandler.destination)) {
        subscriptionHandlers.push(messageHandler);
    }

    Subscribe();
}

function Subscribe(){
    client.deactivate().then();
    client.configure({
        brokerURL: 'ws://localhost:8080/playerManagerWebsocket',
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

export function Publish(dest: string, body: string){
    const destination : string = dest + "/" + lobbyId;
    client.publish({ destination, body });
}