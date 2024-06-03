package voiceManager.extern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.RestController;
import voiceManager.extern.jsonDataTransferTypes.LobbyIdPlayerId;
import voiceManager.extern.jsonDataTransferTypes.LobbyIdPlayerIdMessage;
import voiceManager.extern.jsonDataTransferTypes.WebRTC;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
public class VoiceChatController {

    private final Map<String, List<String>> lobbies = new ConcurrentHashMap<>();
    private final SimpMessageSendingOperations messagingTemplate;

    @Autowired
    public VoiceChatController(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/join")
    public void afterConnectionEstablished(LobbyIdPlayerId message) throws Exception {
        if (message.getPlayerId() == null) {
            return;
        }
        List<String> lobby = lobbies.getOrDefault(message.getLobbyId(), null);
        if (lobby == null) {
            lobby = new ArrayList<>();
        }
        if (!lobby.contains(message.getPlayerId())) {
            lobby.add(message.getPlayerId());
        }
        lobbies.put(message.getLobbyId(), lobby);
    }

    @MessageMapping("/message")
    public void handleTextMessage(LobbyIdPlayerIdMessage message) {
        List<String> lobby = lobbies.getOrDefault(message.getLobbyId(), null);
        if (lobby != null) {
            for (String playerId : lobby) {
                if (!playerId.equals(message.getPlayerId())) {
                    WebRTC webRTC = new WebRTC();
                    webRTC.setSdp(message.getSdp());
                    webRTC.setCandidate(message.getCandidate());
                    webRTC.setType(message.getType());
                    messagingTemplate.convertAndSend("/subscribe/" + message.getLobbyId() + "/" +  playerId, webRTC.toString());
                }
            }
        }
    }

    @MessageMapping("/leave")
    public void afterConnectionClosed(LobbyIdPlayerId message) throws Exception {
        List<String> lobby = lobbies.get(message.getLobbyId());
        if (lobby != null) {
            lobby.remove(message.getPlayerId());
            if (lobby.isEmpty()) {
                lobbies.remove(message.getLobbyId());
            }
        }
    }
}
