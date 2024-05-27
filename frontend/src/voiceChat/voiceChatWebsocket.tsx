import React, { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';

type Props = {
    lobbyId: string;
    myPlayerId: string;
};

const isDebug = process.env.NODE_ENV === 'development';

function getBrokerURL() {
    return isDebug
        ? 'ws://localhost:8085/voiceChatManagerWebsocket'
        : 'ws://10.0.40.168:8085/voiceChatManagerWebsocket';
}

export default function VoiceChat({ lobbyId, myPlayerId }: Props) {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false);
    const remoteStreamRef = useRef<HTMLAudioElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const stompClientRef = useRef<Client | null>(null);

    const initStompClient = () => {
        const stompClient = new Client({
            brokerURL: getBrokerURL(),
            reconnectDelay: 5000,
        });

        stompClient.onConnect = () => {
            stompClient.subscribe(`/subscribe/${lobbyId}/${myPlayerId}`, handleStompMessage);
            stompClient.publish({
                destination: '/send/join',
                body: JSON.stringify({lobbyId: lobbyId, playerId: myPlayerId }),
            });
        };

        stompClient.activate();
        stompClientRef.current = stompClient;
    };

    const handleStompMessage = (message: any) => {
        const messageBody = JSON.parse(message.body);
        switch (messageBody.type) {
            case 'offer':
                handleOfferMessage(messageBody).then();
                break;
            case 'answer':
                handleAnswerMessage(messageBody).then();
                break;
            case 'candidate':
                handleCandidateMessage(messageBody).then();
                break;
            default:
                break;
        }
    };

    const initPeerConnection = () => {
        const peer = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        peer.onicecandidate = (event) => {
            if (event.candidate && stompClientRef.current?.connected) {
                stompClientRef.current.publish({
                    destination: '/send/message',
                    body: JSON.stringify({
                        type: 'candidate',
                        candidate: JSON.stringify(event.candidate),
                        lobbyId: lobbyId,
                        playerId: myPlayerId,
                    }),
                });
            }
        };

        peer.ontrack = (event) => {
            if (remoteStreamRef.current) {
                remoteStreamRef.current.srcObject = event.streams[0];
            }
        };

        peer.onnegotiationneeded = async () => {
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            if (stompClientRef.current?.connected) {
                stompClientRef.current.publish({
                    destination: '/send/message',
                    body: JSON.stringify({
                        type: 'offer',
                        sdp: JSON.stringify(peer.localDescription),
                        lobbyId: lobbyId,
                        playerId: myPlayerId,
                    }),
                });
            }
        };

        peerConnectionRef.current = peer;
    };

    const handleOfferMessage = async (message: any) => {
        const offer = new RTCSessionDescription(message.sdp);
        const peer = peerConnectionRef.current;
        if (peer) {
            await peer.setRemoteDescription(offer);
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            if (stompClientRef.current?.connected) {
                stompClientRef.current.publish({
                    destination: '/send/message',
                    body: JSON.stringify({
                        type: 'answer',
                        sdp: JSON.stringify(peer.localDescription),
                        lobbyId: lobbyId,
                        playerId: myPlayerId,
                    }),
                });
            }
        }
    };

    const handleAnswerMessage = async (message: any) => {
        const answer = new RTCSessionDescription(message.sdp);
        const peer = peerConnectionRef.current;
        if (peer) {
            await peer.setRemoteDescription(answer);
        }
    };

    const handleCandidateMessage = async (message: any) => {
        const candidate = new RTCIceCandidate(message.candidate);
        const peer = peerConnectionRef.current;
        if (peer) {
            await peer.addIceCandidate(candidate);
        }
    };

    const startMicrophone = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setLocalStream(stream);
            stream.getTracks().forEach((track) => {
                const peer = peerConnectionRef.current;
                if (peer && peer.signalingState !== 'closed') {
                    peer.addTrack(track, stream);
                }
            });
        } catch (error) {
            console.error('Error accessing user media:', error);
        }
    };

    const stopMicrophone = () => {
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
        }
    };

    useEffect(() => {
        initStompClient();
        initPeerConnection();

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.publish({
                    destination: '/send/leave',
                    body: JSON.stringify({lobbyId: lobbyId, playerId: myPlayerId }),
                });
                stompClientRef.current.deactivate();
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
            stopMicrophone();
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Space' || event.code === 'v') {
                setIsMicrophoneEnabled(true);
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.code === 'Space' || event.code === 'v') {
                setIsMicrophoneEnabled(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        if (isMicrophoneEnabled) {
            startMicrophone().then();
        } else {
            stopMicrophone();
        }
    }, [isMicrophoneEnabled]);

    return <audio ref={remoteStreamRef} autoPlay />;
}
