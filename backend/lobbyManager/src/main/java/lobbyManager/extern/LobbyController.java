package lobbyManager.extern.jsonDataTransferTypes;

import lobbyManager.Lobbies;
import lobbyManager.Lobby;
import lobbyManager.Player;
import lobbyManager.enumarators.Colors;
import lobbyManager.enumarators.Roles;
import lobbyManager.extern.jsonDataTransferTypes.AddPlayer;
import lobbyManager.extern.jsonDataTransferTypes.ChangeColor;
import lobbyManager.extern.jsonDataTransferTypes.ChangeName;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
public class LobbyController {

    private static final HashMap<String, Lobby> lobbies = new HashMap<>();

    //intern
    @PostMapping(value = "/sendLobby", consumes = "application/json")
    public void addUpdateLobby(@RequestParam String lobbyId, @RequestParam Lobby lobby) {
        lobbies.put(lobbyId,lobby);
    }

    @PostMapping(value = "/sendLobby", consumes = "application/json")
    public void removeLobby(@RequestParam String lobbyId) {
        lobbies.remove(lobbyId);
    }

    //global
    @MessageMapping("/registerPlayer/{stringLobbyId}")
    @SendTo("/subscribe/lobby/{stringLobbyId}")
    public String addPlayer(AddPlayer message){
        System.out.println(Lobbies.getLobbies().size());
        if (message.getLobbyId().isEmpty()){
            return null;
        }
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());

        if (lobby.getPlayers().size() >= 10){
            return null;
        }

        Player player = new Player(message.getPlayerId(), "Player " + lobby.getPlayers().size(), Colors.getColor(lobby.getPlayers().size()), 0, 0, lobby.getPlayers().isEmpty() || lobby.getPlayers().size() % 2 == 0 ? Roles.IMPOSTER : Roles.CREWMATE);
        lobby.addPlayers(player);

        return lobby.getPlayers().values().toString();
    }

    @MessageMapping("/changeName/{stringLobbyId}")
    @SendTo("/subscribe/lobby/{stringLobbyId}")
    public String changeName(ChangeName message){

        if (message.getName().isEmpty()){
            return null;
        }

        Lobby lobby =  Lobbies.getLobby(message.getLobbyId());
        for (Player player : lobby.getPlayers().values()) {
            if (player.getName().equals(message.getName())){
                return null;
            }
        }

        Player player = lobby.getPlayers().get(message.getPlayerId());
        player.setName(message.getName());

        return lobby.getPlayers().values().toString();
    }

    @MessageMapping("/changeColor/{stringLobbyId}")
    @SendTo("/subscribe/lobby/{stringLobbyId}")
    public String changeColor(ChangeColor message){

        Lobby lobby =  Lobbies.getLobby(message.getLobbyId());
        for (Player player : lobby.getPlayers().values()) {
            if (player.getColor().equals(message.getColor())){
                return null;
            }
        }

        Player player = lobby.getPlayers().get(message.getPlayerId());
        player.setColor(message.getColor());

        return lobby.getPlayers().values().toString();
    }
}
