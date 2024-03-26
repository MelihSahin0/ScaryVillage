import {Client} from "@stomp/stompjs";

const client = new Client();

export default function SubscribePlayerMovement(updatePlayers: (message: any) => void) {
    client.deactivate().then();
    client.configure({
        brokerURL: 'ws://localhost:8080/playerManagerWebsocket',
        onConnect: () => {
            client.subscribe('/topic/map', message => {
                updatePlayers(JSON.parse(JSON.parse(message.body).content));
            })
        },
    });
    client.activate();
}

export function GetPlayerId(newPlayer: (message: any) => void){
    fetch('http://localhost:8080/requestId')
        .then((response) => response.json())
        .then((data) => {
            newPlayer(data);
        })
        .catch((err) => {
            console.log(err.message);
        });
}

export function Publish(destination: string, body: string){
    client.publish({destination: destination, body: body});
}