package taskManager.extern;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;
import taskManager.*;
import taskManager.extern.jsonDataTransferTypes.GetTasks;
import taskManager.extern.jsonDataTransferTypes.TaskClicked;
import taskManager.intern.Rest;
import taskManager.tasks.Bin;
import taskManager.tasks.Cave;
import taskManager.tasks.Flooding;
import taskManager.tasks.Task;

import java.util.Map;
import java.util.UUID;

@RestController
public class TaskManagerController {

    //When Endpoints can be called internally too, use this. (Reference: removePlayer)
    private final SimpMessagingTemplate messagingTemplate = ApplicationContextHolder.getContext().getBean(SimpMessagingTemplate.class);

    @MessageMapping("/tasks/{stringLobbyId}")
    @SendTo("/subscribe/getPlayerTasks/{stringLobbyId}")
    public String getUnfinishedTasks(GetTasks message){
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());
        if (lobby == null) {
            return null;
        }
        return lobby.toString();
    }

    @MessageMapping("/doTaskRequest/{stringLobbyId}")
    @SendTo("/subscribe/getPlayerTodoTask/{stringLobbyId}")
    public String doTask(TaskClicked message){
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());
        if (lobby == null) {
            return null;
        }
        if (lobby.getPlayersTask(message.getPlayerId()).getTask(message.getTaskId()) == null) {return null;} // Otherwise throws error for sabotage
        Task task = lobby.getPlayersTask(message.getPlayerId()).getTask(message.getTaskId());
        if (!task.insideRadius(Rest.getPlayerPosi(message.getLobbyId(), message.getPlayerId()))){
            return null;
        }

        if (task.getClass().getSimpleName().equals(Bin.class.getSimpleName())) {
            for (Map.Entry<String, Task> cave : lobby.getPlayersTask(message.getPlayerId()).getTasks()){
                if (cave.getValue().getClass().getSimpleName().equals(Cave.class.getSimpleName())){
                    System.out.println(message.getTaskId());
                    System.out.println(message.getTaskId() + "@");
                    cave.getValue().setTaskId(message.getTaskId() + "@");
                    return  "{" +
                            "\"" + message.getPlayerId() + "\": "
                                 + cave.getValue() +
                            "}";
                }
            }
            return null;
        }

        return "{" +
                "\"" + message.getPlayerId() + "\": "
                     + task +
                "}";
    }

    @MessageMapping("/taskFinished/{stringLobbyId}")
    @SendTo("/subscribe/getPlayerTasks/{stringLobbyId}")
    public String taskFinished(TaskClicked message){
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());
        if (lobby == null) {
            return null;
        }

        //the @ is in there if it is a bin task. It is appended to its id when being sent back to frontend.
        Task task = lobby.getPlayersTask(message.getPlayerId()).getTask(message.getTaskId().replace("@", "").trim());
        if (task.getDifficulty() == TaskDifficulty.EXTENSION && !task.insideRadius(Rest.getPlayerPosi(message.getLobbyId(), message.getPlayerId()))){
            return null;
        }
        if (message.getTaskId().contains("@")){
            for (Map.Entry<String, Task> cave : lobby.getPlayersTask(message.getPlayerId()).getTasks()){
                if (cave.getValue().getClass().getSimpleName().equals(Cave.class.getSimpleName())){
                    if (!cave.getValue().insideRadius(Rest.getPlayerPosi(message.getLobbyId(), message.getPlayerId()))){
                        return null;
                    } else {
                        break;
                    }
                }
            }
        } else {
            if (!task.insideRadius(Rest.getPlayerPosi(message.getLobbyId(), message.getPlayerId()))){
                return null;
            }
        }

        task.setStatus(TaskStatus.FINISHED);
        newProgress(message.getLobbyId());

        return lobby.toString();
    }

    public void newProgress(String lobbyId){
        int totalNumberOfTasks = 0;
        int finishedNumberOfTasks = 0;

        Lobby lobby = Lobbies.getLobby(lobbyId);

        for (Map.Entry<String, Tasks> tasks : lobby.getPlayerTasks()){
            for (Map.Entry<String, Task> task : tasks.getValue().getTasks()){
                if (task.getValue().getDifficulty() != TaskDifficulty.EXTENSION && task.getValue().getDifficulty() != TaskDifficulty.REQUIRED) {
                    totalNumberOfTasks++;

                    if (task.getValue().getStatus() == TaskStatus.FINISHED) {
                        finishedNumberOfTasks++;
                    }
                }
            }
        }

        messagingTemplate.convertAndSend("/subscribe/getProgress/" + lobbyId, "{\"progress\":"  + (double)finishedNumberOfTasks/totalNumberOfTasks +"}");

        if (finishedNumberOfTasks == totalNumberOfTasks){
            Rest.gameFinished(lobbyId);
            Lobbies.removeLobby(lobbyId);
        }
    }

    @MessageMapping("/initiateSabotage/{stringLobbyId}")
    @SendTo("/subscribe/sabotageTask/{stringLobbyId}")
    public String sabotage(TaskClicked message){
        System.out.println("AHHHHHHHHHHHHHHHHHHHHHHHHHHHHH " + message.getTaskId());
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());

        Flooding flooding = new Flooding();
        flooding.setTaskId(UUID.randomUUID().toString());
        Task.Position position = new Task.Position();
        position.setX(-3.85);
        position.setY(0.16090551000000003);
        flooding.setPosition(position);
        Task.Scale scale = new Task.Scale();
        scale.setHeight(0.3);
        scale.setWidth(0.2);
        flooding.setScale(scale);
        flooding.setDifficulty(TaskDifficulty.MEDIUM);
        flooding.setRadius(5);
        flooding.setStatus(TaskStatus.TODO);

        lobby.setSabotage(0, true);
        lobby.checkSabotage(message.getLobbyId());

        return flooding.toString();
    }

    @MessageMapping("/sabotageDone/{stringLobbyId}")
    @SendTo("/subscribe/sabotageDone/{stringLobbyId}")
    public String sabotageDone(TaskClicked message) {
        System.out.println("SABOTAGE FINISHED");
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());

        // TODO: make it go for a specific value in the array of sabotage
        lobby.setSabotage(0, false);
        return lobby.toString();

    }

}
