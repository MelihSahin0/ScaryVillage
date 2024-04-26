package taskManager.intern;

import extern.enumarators.Roles;
import intern.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import taskManager.Lobbies;
import taskManager.Lobby;
import taskManager.Tasks;
import taskManager.tasks.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

@RestController
@RequestMapping("/taskManager/intern")
public class Rest {

    @PostMapping("/addLobby")
    public void addLobby(@RequestBody LobbyIdPlayerHashMap message){
        Lobby lobby = new Lobby();
        //3 easy Tasks, 2 medium Tasks, 1 hard Task (separate for-loop)
        for (Map.Entry<String, Player> player : message.getPlayers().entrySet()){
            if (player.getValue().getRole() == Roles.CREWMATE) {
                Tasks tasks = new Tasks();
                for (int i = 0; i < 3; i++) {
                    String uuid;
                    Task task;
                    do {
                        uuid = UUID.randomUUID().toString().replace("-", "");
                        Random r = new Random();
                        task = switch (r.nextInt(0, 3)) {
                            case 0 -> tasks.getNumberOfTaskType(Bin.class) == 4 ? null : new Bin(uuid, tasks.getNumberOfTaskType(Bin.class));
                            case 1 -> tasks.getNumberOfTaskType(Cooking.class) == 2 ? null : new Cooking(uuid, tasks.getNumberOfTaskType(Cooking.class));
                            case 2 -> tasks.getNumberOfTaskType(Sleeping.class) == 2 ? null : new Sleeping(uuid, tasks.getNumberOfTaskType(Sleeping.class));
                            default -> null;
                        };
                    } while (task == null);
                    tasks.addTask(uuid, task);
                }
                for (int i = 0; i < 2; i++) {
                    String uuid;
                    Task task;
                    do {
                        uuid = UUID.randomUUID().toString().replace("-", "");
                        Random r = new Random();
                        task = switch (r.nextInt(0, 2)) {
                            case 0 -> tasks.getNumberOfTaskType(Mining.class) == 1 ? null : new Mining(uuid, tasks.getNumberOfTaskType(Mining.class));
                            case 1 -> tasks.getNumberOfTaskType(Chopping.class) == 2 ? null : new Chopping(uuid, tasks.getNumberOfTaskType(Chopping.class));
                            default -> null;
                        };
                    } while (task == null);
                    tasks.addTask(uuid, task);
                }
                for (int i = 0; i < 1; i++) {
                    String uuid;
                    Task task;
                    do {
                        uuid = UUID.randomUUID().toString().replace("-", "");
                        Random r = new Random();
                        task = switch (r.nextInt(0, 2)) {
                            case 0 -> tasks.getNumberOfTaskType(Fishing.class) == 1 ? null : new Fishing(uuid, tasks.getNumberOfTaskType(Fishing.class));
                            case 1 -> tasks.getNumberOfTaskType(Chicken.class) == 1 ? null : new Chicken(uuid, tasks.getNumberOfTaskType(Chicken.class));
                            default -> null;
                        };
                    } while (task == null);
                    tasks.addTask(uuid, task);
                }
                lobby.setPlayersTask(player.getKey(), tasks);
            }
        }
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
}
