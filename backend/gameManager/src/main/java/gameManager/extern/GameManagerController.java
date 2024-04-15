package gameManager.extern;

import extern.enumarators.Visibility;
import gameManager.Lobbies;
import gameManager.Lobby;
import gameManager.extern.jsonDataTransferTypes.GetLobbyId;
import gameManager.intern.Rest;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.UUID;
import extern.enumarators.GameStatus;

@RestController
public class GameManagerController {

    @MessageMapping("/registerLobby")
    @SendTo("/subscribe/lobbyId")
    public String createLobby(GetLobbyId message) {
        String  uuid = UUID.randomUUID().toString().replace("-", "");

        Lobbies.addLobby(uuid);
        Rest.addLobby(uuid);

        message.setLobbyId(uuid);
        return message.toString();
    }

    @MessageMapping("/joinLobby")
    @SendTo("/subscribe/lobbyId")
    public String findLobbyToJoin(GetLobbyId message) {
        if (message.getLobbyId().isEmpty()){
            for (Map.Entry<String, Lobby> lobby : Lobbies.getLobbies()) {
                if (lobby.getValue().getGameStatus() == GameStatus.LOBBY && lobby.getValue().getNumberOfPlayers() < lobby.getValue().getMaxNumberOfPlayers() && lobby.getValue().getVisibility() == Visibility.PUBLIC) {
                    message.setLobbyId(lobby.getKey());
                    return message.toString();
                }
            }
        } else {
            Lobby lobby = Lobbies.getLobby(message.getLobbyId());
            if (lobby == null || lobby.getGameStatus() == GameStatus.INGAME || lobby.getNumberOfPlayers() == lobby.getMaxNumberOfPlayers()) {
                message.setLobbyId("");
            }
            return message.toString();
        }

        return message.toString();
    }
}
