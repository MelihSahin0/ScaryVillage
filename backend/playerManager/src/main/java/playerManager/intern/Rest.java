package playerManager.intern;

import extern.Player;
import intern.LobbyId;
import intern.LobbyIdPlayerHashMap;
import intern.LobbyIdPlayerId;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import playerManager.Lobbies;
import playerManager.Lobby;

import java.util.Map;

@RestController
@RequestMapping("/playerManager/intern")
public class Rest {

    @PostMapping(value = "/addLobby")
    public void addLobby(@RequestBody LobbyIdPlayerHashMap message) {
        Lobby lobby = new Lobby();

        for (Map.Entry<String, Player> player : message.getPlayers().entrySet()){
            playerManager.Player inGamePlayer = new playerManager.Player(player.getValue().getId(), player.getValue().getName(), player.getValue().getColor(), 0,0,player.getValue().getRole(), player.getValue().isHost());
            lobby.addPlayer(inGamePlayer);
        }

        Lobbies.addLobby(message.getLobbyId(), lobby);
    }

    @PostMapping(value = "/removeLobby")
    public void removeLobby(@RequestBody LobbyId message){
        Lobbies.removeLobby(message.getLobbyId());
    }

    @PostMapping(value = "/changeHost")
    public void changeHost(@RequestBody LobbyIdPlayerId message) {
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());

        for (Map.Entry<String, playerManager.Player> player: lobby.getPlayers().entrySet()){
            player.getValue().setHost(false);
        }

        lobby.getPlayer(message.getPlayerId()).setHost(true);
    }
}
