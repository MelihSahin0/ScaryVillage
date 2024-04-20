package votingManager.intern;

import intern.LobbyId;
import intern.LobbyIdPlayerHashMap;
import intern.LobbyIdPlayerHashMapString;
import intern.Player;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import votingManager.Lobbies;
import votingManager.Lobby;

import java.util.Map;

@RestController
@RequestMapping("/votingManager/intern")
public class Rest {

    @PostMapping(value = "/addLobby")
    public void addLobby(@RequestBody LobbyIdPlayerHashMapString message) {
        Lobby lobby = new Lobby();
        lobby.setLobbyId(message.getLobbyId());
        for (Map.Entry<String, Player> player : message.getPlayers().entrySet()){
            votingManager.Player votingPlayer = new votingManager.Player(player.getValue().getId(), player.getValue().getName(), player.getValue().getColor(),player.getValue().getRole());
            if (votingPlayer.getId().equals(message.getExtra())){
                votingPlayer.setRequester(true);
            }
            lobby.addPlayer(votingPlayer);
        }
        Lobbies.addLobby(message.getLobbyId(), lobby);
        lobby.startTimer();
    }

    public static void sendResult(String lobbyId){
        LobbyIdPlayerHashMap lobbyIdPlayerHashMap = new LobbyIdPlayerHashMap();
        lobbyIdPlayerHashMap.setLobbyId(lobbyId);
        for (votingManager.Player player : Lobbies.getLobby(lobbyId).getPlayers().values()) {
            lobbyIdPlayerHashMap.setPlayer(player.getId(), new intern.Player(player.getId(), player.getName(), player.getColor(), player.getRole()));
        }

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://localhost:8080/playerManager/intern/votingResult",
                lobbyIdPlayerHashMap,
                String.class);
    }

    public static void gameFinished(String lobbyId){
        LobbyId lobbyId1 = new LobbyId();
        lobbyId1.setLobbyId(lobbyId);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://localhost:8080/playerManager/intern/gameFinished",
                lobbyId1,
                String.class);
    }
}
