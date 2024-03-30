import {Client} from "@stomp/stompjs";

type MessageHandler = {
    destination: string,
    function: (message: any) => void
};
const subscriptionHandlers: MessageHandler[] = [];
const client = new Client();

export function SubscribePlayerMovement(updatePlayers: (message: any) => void) {

    const messageHandler: MessageHandler = {
        destination: "/subscribe/playerPosition",
        function: updatePlayers
    };

    if (!subscriptionHandlers.find(handler => handler.destination === messageHandler.destination)) {
        subscriptionHandlers.push(messageHandler);
    }

    Subscribe();
}

export function SubscribeJoinLobby(joinLobby: (messages: any) => void){

    const messageHandler: MessageHandler = {
        destination: "/subscribe/lobby",
        function: joinLobby
    };

    if (!subscriptionHandlers.find(handler => handler.destination === messageHandler.destination)) {
        subscriptionHandlers.push(messageHandler);
    }

    Subscribe();
}

export function SubscribeKill(killPlayers: (message: any) => void) {

    const messageHandler: MessageHandler = {
        destination: "/subscribe/kill",
        function: killPlayers
    };

    if (!subscriptionHandlers.find(handler => handler.destination === messageHandler.destination)) {
        subscriptionHandlers.push(messageHandler);
        console.log("AHHHH");
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

export function Publish(destination: string, body: string){
    client.publish({ destination, body });
}