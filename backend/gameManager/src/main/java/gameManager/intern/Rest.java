package gameManager.intern;

import gameManager.Lobbies;
import intern.LobbyId;
import intern.LobbyIdGameStatus;
import intern.LobbyIdInteger;
import intern.LobbyIdVisibility;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/gameManager/intern")
public class Rest {

    @PostMapping(value = "/changeGameStatus")
    public void changeGameStatus(@RequestBody LobbyIdGameStatus message) {
        Lobbies.getLobby(message.getLobbyId()).setGameStatus(message.getGameStatus());
    }

    @PostMapping(value = "/changeNumberOfPlayers")
    public void changeNumberOfPlayers(@RequestBody LobbyIdInteger message){
        Lobbies.getLobby(message.getLobbyId()).setNumberOfPlayers(message.getNumber());
    }

    @PostMapping(value = "/changeMaxNumberOfPlayers")
    public void changeMaxNumberOfPlayers(@RequestBody LobbyIdInteger message){
        Lobbies.getLobby(message.getLobbyId()).setMaxNumberOfPlayers(message.getNumber());
    }

    @PostMapping(value = "/changeNumberOfImpostor")
    public void changeNumberOfImpostor(@RequestBody LobbyIdInteger message){
        Lobbies.getLobby(message.getLobbyId()).setNumberOfImpostor(message.getNumber());
    }

    @PostMapping(value = "/removeLobby")
    public void removeLobby(@RequestBody LobbyId message){
       Lobbies.removeLobby(message.getLobbyId());
    }

    @PostMapping(value = "/changeVisibility")
    public void changeVisibility(@RequestBody LobbyIdVisibility message){
        Lobbies.getLobby(message.getLobbyId()).setVisibility(message.getVisibility());
    }

    public static void addLobby(String lobbyId){
        LobbyId lobbyIdSend = new LobbyId();
        lobbyIdSend.setLobbyId(lobbyId);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Boolean> response = restTemplate.postForEntity(
                "http://localhost:8082/lobbyManager/intern/addLobby",
                lobbyIdSend,
                Boolean.class);
    }
}
