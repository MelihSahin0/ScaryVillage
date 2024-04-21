package playerManager.intern;

import intern.LobbyIdPlayerHashMapString;
import intern.LobbyId;
import intern.LobbyIdPlayerHashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import playerManager.Lobbies;
import playerManager.Lobby;
import playerManager.Player;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/playerManager/intern")
public class Rest {

    @PostMapping(value = "/addLobby")
    public void addLobby(@RequestBody LobbyIdPlayerHashMap message) {
        Lobby lobby = new Lobby();

        for (Map.Entry<String, intern.Player> player : message.getPlayers().entrySet()){
            playerManager.Player inGamePlayer = new playerManager.Player(player.getValue().getId(), player.getValue().getName(), player.getValue().getColor(), 0,0,player.getValue().getRole(), 10);
            lobby.addPlayer(inGamePlayer);
        }

        Lobbies.addLobby(message.getLobbyId(), lobby);
    }

    @PostMapping(value = "/removeLobby")
    public void removeLobby(@RequestBody LobbyId message){
        Lobbies.removeLobby(message.getLobbyId());
    }

    @PostMapping(value = "/gameFinished")
    public void gameFinished(@RequestBody LobbyId message){
        Lobbies.removeLobby(message.getLobbyId());
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://localhost:8082/lobbyManager/intern/gameFinished",
                message,
                String.class);
    }

    @PostMapping(value = "/votingResult")
    public void votingResult(@RequestBody LobbyIdPlayerHashMap message){
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());
        for (Map.Entry<String, intern.Player> player : message.getPlayers().entrySet()){
            Player player1 = lobby.getPlayer(player.getKey());
            player1.setRole(player.getValue().getRole());
            player1.setColor(player.getValue().getColor());
        }
    }


    public static void startVoting(String lobbyId, HashMap<String, playerManager.Player> players, String requester){
        LobbyIdPlayerHashMapString lobbyIdPlayerHashMapString = new LobbyIdPlayerHashMapString();
        lobbyIdPlayerHashMapString.setLobbyId(lobbyId);
        for (Player player : players.values()) {
            lobbyIdPlayerHashMapString.setPlayer(player.getId(), new intern.Player(player.getId(), player.getName(), player.getColor(), player.getRole()));
        }
        lobbyIdPlayerHashMapString.setExtra(requester);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://localhost:8083/votingManager/intern/addLobby",
                lobbyIdPlayerHashMapString,
                String.class);
    }
}
