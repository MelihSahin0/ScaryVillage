package gameManager;

import gameManager.jsonDataTransferTypes.GetLobbyId;
import gameManager.jsonDataTransferTypes.LobbyStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;
import playerManager.PlayerManagerController;
import playerManager.enumarators.GameStatus;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
public class GameManagerController {

    HashMap<String, PlayerManagerController> playerManagerControllerHashMap = new HashMap<>();

    @MessageMapping("/registerLobby")
    @SendTo("/subscribe/lobbyId")
    public String createLobby(GetLobbyId message) {
        String  uuid = UUID.randomUUID().toString().replace("-", "");

        playerManagerControllerHashMap.put(uuid, PlayerManagerController.addLobby(uuid));
        message.setLobbyId(uuid);
        return message.toString();
    }

    @MessageMapping("/joinLobby")
    @SendTo("/subscribe/lobbyId")
    public String joinLobby(GetLobbyId message) {
        if (message.getLobbyId().isEmpty()){
            for (Map.Entry<String, PlayerManagerController> entry : playerManagerControllerHashMap.entrySet()) {
                if (entry.getValue().getGameStatus() == GameStatus.LOBBY) {
                    message.setLobbyId(entry.getKey());
                    return message.toString();
                }
            }
        } else {
            PlayerManagerController playerManagerController = playerManagerControllerHashMap.get(message.getLobbyId());
            if (playerManagerController == null || playerManagerController.getGameStatus() != GameStatus.LOBBY) {
                message.setLobbyId("");
            }
            return message.toString();
        }

        return message.toString();
    }

    @MessageMapping("/setLobbyStatus")
    public void setLobbyStatus(LobbyStatus message){
        PlayerManagerController playerManagerController = playerManagerControllerHashMap.get(message.getLobbyId());

        if (playerManagerController != null){
            playerManagerController.setGameStatus(message.getGameStatus());
        }
    }
}
