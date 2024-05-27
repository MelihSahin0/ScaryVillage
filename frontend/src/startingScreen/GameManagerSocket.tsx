import {Client} from "@stomp/stompjs";

type MessageHandler = {
    id: number;
    destination: string;
    function: (message: any) => void;
};
let subscriptionHandlers: MessageHandler[] = [];
const client = new Client();

const isDebug = process.env.NODE_ENV === 'development';

function getBrokerURL() {
    if (isDebug) {
        return 'ws://localhost:8081/gameManagerWebsocket';
    } else {
        return 'wss://10.0.40.168:8081/gameManagerWebsocket';
    }
}

export function SubscribeGetLobby(lobbyId: (message: any) => void) {

    const messageHandler: MessageHandler = {
        id: 0,
        destination: "/subscribe/lobbyId",
        function: lobbyId
    };

    if (!subscriptionHandlers.find(handler => handler.id === messageHandler.id)) {
        subscriptionHandlers.push(messageHandler);
    }
    StartConnection();
}
export function UnsubscribeGetLobby(){
    subscriptionHandlers = subscriptionHandlers.filter(handler => handler.id !== 0);
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

export function Publish(destination: string, body: string){
    client.publish({ destination, body });
}