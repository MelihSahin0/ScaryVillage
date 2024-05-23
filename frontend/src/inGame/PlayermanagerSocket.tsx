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
        return 'ws://localhost:8083/playerManagerWebsocket';
    } else {
        // Specify your production URL here
        return 'ws://http://10.0.40.168:5173/playerManagerWebsocket';
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
    StartConnection();
}
export function UnsubscribePlayers(){
    subscriptionHandlers = subscriptionHandlers.filter(handler => handler.id !== 0);
    StartConnection();
}

export function SubscribePlayerMovement(updatePlayers: (message: any) => void) {

    const messageHandler: MessageHandler = {
        id: 1,
        destination: "/subscribe/playerPosition/" + lobbyId,
        function: updatePlayers
    };

    if (!subscriptionHandlers.find(handler => handler.id === messageHandler.id)) {
        subscriptionHandlers.push(messageHandler);
    }

    StartConnection();
}
export function UnsubscribePlayerMovement(){
    subscriptionHandlers = subscriptionHandlers.filter(handler => handler.id !== 1);
    StartConnection();
}

export function SubscribeKill(killPlayers: (message: any) => void) {

    const messageHandler: MessageHandler = {
        id: 2,
        destination: "/subscribe/kill/" + lobbyId,
        function: killPlayers
    };

    if (!subscriptionHandlers.find(handler => handler.id === messageHandler.id)) {
        subscriptionHandlers.push(messageHandler);
    }

    StartConnection();
}
export function UnsubscribeKill(){
    subscriptionHandlers = subscriptionHandlers.filter(handler => handler.id !== 2);
    StartConnection();
}

export function SubscribeReport(report: (message: any) => void) {

    const messageHandler: MessageHandler = {
        id: 3,
        destination: "/subscribe/report/" + lobbyId,
        function: report
    };

    if (!subscriptionHandlers.find(handler => handler.id === messageHandler.id)) {
        subscriptionHandlers.push(messageHandler);
    }

    StartConnection();
}
export function UnsubscribeReport(){
    subscriptionHandlers = subscriptionHandlers.filter(handler => handler.id !== 3);
    StartConnection();
}

export function SubscribeKillCooldown(report: (message: any) => void) {

    const messageHandler: MessageHandler = {
        id: 4,
        destination: "/subscribe/killCooldown/" + lobbyId,
        function: report
    };

    if (!subscriptionHandlers.find(handler => handler.id === messageHandler.id)) {
        subscriptionHandlers.push(messageHandler);
    }

    StartConnection();
}
export function UnsubscribeKillCooldown(){
    subscriptionHandlers = subscriptionHandlers.filter(handler => handler.id !== 4);
    StartConnection();
}

export function SubscribeBellCooldown(report: (message: any) => void) {

    const messageHandler: MessageHandler = {
        id: 5,
        destination: "/subscribe/bellCooldown/" + lobbyId,
        function: report
    };

    if (!subscriptionHandlers.find(handler => handler.id === messageHandler.id)) {
        subscriptionHandlers.push(messageHandler);
    }

    StartConnection();
}
export function UnsubscribeBellCooldown(){
    subscriptionHandlers = subscriptionHandlers.filter(handler => handler.id !== 5);
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