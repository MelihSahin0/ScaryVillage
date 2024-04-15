import {Client} from "@stomp/stompjs";

type MessageHandler = {
    id: number;
    destination: string,
    function: (message: any) => void
};
let subscriptionHandlers: MessageHandler[] = [];
const client = new Client();

export function SubscribeGetLobby(lobbyId: (message: any) => void) {

    const messageHandler: MessageHandler = {
        id: 0,
        destination: "/subscribe/lobbyId",
        function: lobbyId
    };

    if (!subscriptionHandlers.find(handler => handler.destination === messageHandler.destination)) {
        subscriptionHandlers.push(messageHandler);
    }
    Subscribe();
}

export function UnscubscribeGetLobby(){
    subscriptionHandlers = [];
}

function Subscribe(){
    client.deactivate().then();
    client.configure({
        brokerURL: 'ws://localhost:8081/gameManagerWebsocket',
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

export function Publish(destination: string, body: string){
    client.publish({ destination, body });
}