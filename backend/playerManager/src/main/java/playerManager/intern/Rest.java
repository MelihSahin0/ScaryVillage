package playerManager.intern;

import intern.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
        Lobby lobby = new Lobby(message.getBellCooldown());
        lobby.setVotingTime(message.getVotingTime());
        lobby.setKillOne(message.getKillOne());
        lobby.setChangeVotingNumberVisibility(message.getChangeVotingNumberVisibility());
        for (Map.Entry<String, intern.Player> player : message.getPlayers().entrySet()){
            playerManager.Player inGamePlayer = new playerManager.Player(player.getValue().getId(), player.getValue().getName(), player.getValue().getColor(), 0,0,player.getValue().getRole(), message.getKillCooldown());
            lobby.addPlayer(inGamePlayer);
        }
        lobby.startBellCooldown(message.getLobbyId(), 2);
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
        ResponseEntity<String> response2= restTemplate.postForEntity(
                "http://localhost:8084/taskManager/intern/removeLobby",
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
        for (Player player :Lobbies.getLobby(message.getLobbyId()).getPlayers().values()) {
            player.newPosition(0,0);
        }
        lobby.startBellCooldown(message.getLobbyId(),10);

    }

    @PostMapping(value = "/getPlayerPosition")
    public PlayerPosi getPlayerPosition(@RequestBody LobbyIdPlayerId message){
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());
        if (lobby == null){
            return null;
        }
        Player player = lobby.getPlayer(message.getPlayerId());
        if (player == null){
            return null;
        }

        PlayerPosi playerPosition = new PlayerPosi();
        playerPosition.setX(player.getX());
        playerPosition.setY(player.getY());

        return playerPosition;
    }

    public static void startVoting(String lobbyId, HashMap<String, playerManager.Player> players, String requester,
                                   int votingTime, boolean killOne, boolean changeVotingNumberVisibility){
        LobbyIdPlayerHashMapString lobbyIdPlayerHashMapString = new LobbyIdPlayerHashMapString();
        lobbyIdPlayerHashMapString.setLobbyId(lobbyId);
        lobbyIdPlayerHashMapString.setVotingTime(votingTime);
        lobbyIdPlayerHashMapString.setKillOne(killOne);
        lobbyIdPlayerHashMapString.setChangeVotingNumberVisibility(changeVotingNumberVisibility);
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
