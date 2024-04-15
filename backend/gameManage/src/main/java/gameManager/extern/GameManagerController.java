package gameManager;

import gameManager.jsonDataTransferTypes.GetLobbyId;
import gameManager.jsonDataTransferTypes.LobbyStatus;
import lobbyManager.Lobbies;
import lobbyManager.Lobby;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lobbyManager.enumarators.GameStatus;

@RestController
public class GameManagerController {

    private static final HashMap<String, Lobby> lobbies = new HashMap<>();

    //intern



    //global
    @MessageMapping("/registerLobby")
    @SendTo("/subscribe/lobbyId")
    public String createLobby(GetLobbyId message) {
        String  uuid = UUID.randomUUID().toString().replace("-", "");

        Lobbies.createLobby(uuid);
        System.out.println(Lobbies.getLobbies().size());

        message.setLobbyId(uuid);
        return message.toString();
    }

    @MessageMapping("/joinLobby")
    @SendTo("/subscribe/lobbyId")
    public String findLobbyToJoin(GetLobbyId message) {
        if (message.getLobbyId().isEmpty()){
            for (Map.Entry<String, Lobby> lobby : Lobbies.getLobbies()) {
                if (lobby.getValue().getGameStatus() == GameStatus.LOBBY) {
                    message.setLobbyId(lobby.getKey());
                    return message.toString();
                }
            }
        } else {
            Lobby lobby = Lobbies.getLobby(message.getLobbyId());
            if (lobby == null || lobby.getGameStatus() != GameStatus.LOBBY) {
                message.setLobbyId("");
            }
            return message.toString();
        }

        return message.toString();
    }

    @MessageMapping("/setLobbyStatus")
    public void setLobbyStatus(LobbyStatus message){
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());

        if (lobby != null){
            lobby.setGameStatus(message.getGameStatus());
        }
    }
}
