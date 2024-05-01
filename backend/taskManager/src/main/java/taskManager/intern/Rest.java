package taskManager.intern;

import com.fasterxml.jackson.databind.ObjectMapper;
import intern.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import taskManager.*;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/taskManager/intern")
public class Rest {

    @PostMapping("/addLobby")
    public void addLobby(@RequestBody LobbyIdPlayerHashMap message) throws IOException {
        Lobby lobby = new Lobby();

        ObjectMapper mapper = new ObjectMapper();
        File jsonFile = new File("taskManager/src/main/java/taskManager/VillageMeshes.json");
        VillageMeshesDTO villageMeshesDTO = mapper.readValue(jsonFile, VillageMeshesDTO.class);

        Utility utility = new Utility();
        utility.setPlayersTask(lobby, villageMeshesDTO, message.getPlayers());

        Lobbies.addLobby(message.getLobbyId(), lobby);
    }

    @PostMapping("/removeLobby")
    public void removeLobby(LobbyId message) {
        Lobbies.removeLobby(message.getLobbyId());
    }

    public static PlayerPosi getPlayerPosi(String lobbyId, String playerId){
        LobbyIdPlayerId message = new LobbyIdPlayerId();
        message.setLobbyId(lobbyId);
        message.setPlayerId(playerId);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<PlayerPosi> response = restTemplate.postForEntity(
                "http://localhost:8080/playerManager/intern/getPlayerPosition",
                message,
                PlayerPosi.class);

        return response.getBody();
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
