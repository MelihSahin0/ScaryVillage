package lobbyManager.intern;

import lobbyManager.Player;
import extern.enumarators.Visibility;
import intern.*;
import extern.enumarators.GameStatus;
import lobbyManager.Lobbies;
import lobbyManager.Lobby;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;

@RestController
@RequestMapping("/lobbyManager/intern")
public class Rest {

    @PostMapping(value = "/addLobby")
    public void addLobby(@RequestBody LobbyId message) {

        Lobby lobby = new Lobby();
        lobby.setLobbyId(message.getLobbyId());
        lobby.setGameStatus(GameStatus.LOBBY);
        lobby.setMaxNumberOfPlayers(10);
        lobby.setMaxImposter(1);
        lobby.setVisibility(Visibility.PRIVATE);
        Lobbies.addLobby(message.getLobbyId(), lobby);
    }

    @PostMapping(value = "/gameFinished")
    public void gameFinished(@RequestBody LobbyId message) {
        Lobbies.getLobby(message.getLobbyId()).setGameStatus(GameStatus.LOBBY);
        changeGameState(message.getLobbyId(), GameStatus.LOBBY);
    }

    public static void changeGameState(String lobbyId, GameStatus gameStatus){
        LobbyIdGameStatus lobbyIdGameStatus = new LobbyIdGameStatus();
        lobbyIdGameStatus.setLobbyId(lobbyId);
        lobbyIdGameStatus.setGameStatus(gameStatus);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://localhost:8081/gameManager/intern/changeGameStatus",
                lobbyIdGameStatus,
                String.class);
    }

    public static void changeNumberOfPlayers(String lobbyId, int numberOfPlayers){
        LobbyIdInteger lobbyIdInteger = new LobbyIdInteger();
        lobbyIdInteger.setLobbyId(lobbyId);
        lobbyIdInteger.setNumber(numberOfPlayers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://localhost:8081/gameManager/intern/changeNumberOfPlayers",
                lobbyIdInteger,
                String.class);
    }

    public static void changeMaxNumberOfPlayers(String lobbyId, int maxNumberOfPlayers){
        LobbyIdInteger lobbyIdInteger = new LobbyIdInteger();
        lobbyIdInteger.setLobbyId(lobbyId);
        lobbyIdInteger.setNumber(maxNumberOfPlayers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://localhost:8081/gameManager/intern/changeMaxNumberOfPlayers",
                lobbyIdInteger,
                String.class);
    }

    public static void removeLobby(String lobbyId){
        LobbyId lobbyIdSend = new LobbyId();
        lobbyIdSend.setLobbyId(lobbyId);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://localhost:8081/gameManager/intern/removeLobby",
                lobbyIdSend,
                String.class);
        ResponseEntity<String> response2 = restTemplate.postForEntity(
                "http://localhost:8080/playerManager/intern/removeLobby",
                lobbyIdSend,
                String.class);
    }

    public static void changeVisibility(String lobbyId, Visibility visibility){
        LobbyIdVisibility lobbyIdVisibility = new LobbyIdVisibility();
        lobbyIdVisibility.setLobbyId(lobbyId);
        lobbyIdVisibility.setVisibility(visibility);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://localhost:8081/gameManager/intern/changeVisibility",
                lobbyIdVisibility,
                String.class);
    }

    public static void addLobby(String lobbyId, HashMap<String, Player> players, int bellCooldown, int killCooldown, int votingTime){
        LobbyIdPlayerHashMap lobbyIdPlayerHashMap = new LobbyIdPlayerHashMap();
        lobbyIdPlayerHashMap.setLobbyId(lobbyId);
        lobbyIdPlayerHashMap.setBellCooldown(bellCooldown);
        lobbyIdPlayerHashMap.setKillCooldown(killCooldown);
        lobbyIdPlayerHashMap.setVotingTime(votingTime);

        for(Player player : players.values()){
            lobbyIdPlayerHashMap.setPlayer(player.getId(), new intern.Player(player.getId(),player.getName(),player.getColor(),player.getRole()));
        }

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(
                "http://localhost:8080/playerManager/intern/addLobby",
                lobbyIdPlayerHashMap,
                String.class);
    }
}
