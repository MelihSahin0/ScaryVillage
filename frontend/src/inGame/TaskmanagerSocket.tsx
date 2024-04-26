import {Client} from "@stomp/stompjs";

type MessageHandler = {
    id: number;
    destination: string;
    function: (message: any) => void;
};
let subscriptionHandlers: MessageHandler[] = [];
const client = new Client();
let lobbyId = "";

export function SubscribeToLobby(id: string){
    lobbyId = id;
}

export function SubscribePlayerTasks(updatePlayers: (message: any) => void) {

    const messageHandler: MessageHandler = {
        id: 0,
        destination: "/subscribe/getPlayerTasks/" + lobbyId,
        function: updatePlayers
    };

    if (!subscriptionHandlers.find(handler => handler.id === messageHandler.id)) {
        subscriptionHandlers.push(messageHandler);
    }
    StartConnection();
}
export function UnsubscribePlayerTasks(){
    subscriptionHandlers = subscriptionHandlers.filter(handler => handler.id !== 0);
    StartConnection();
}

function StartConnection(){
    client.deactivate().then();
    client.configure({
        brokerURL: 'ws://localhost:8084/taskManagerWebsocket',
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