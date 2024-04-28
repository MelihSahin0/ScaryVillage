package taskManager.extern;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;
import taskManager.Lobbies;
import taskManager.Lobby;
import taskManager.TaskStatus;
import taskManager.Tasks;
import taskManager.extern.jsonDataTransferTypes.GetTasks;
import taskManager.extern.jsonDataTransferTypes.TaskFinished;
import taskManager.intern.Rest;
import taskManager.tasks.Task;

import java.util.Map;

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

    @MessageMapping("/taskFinished/{stringLobbyId}")
    @SendTo("/subscribe/getPlayerTasks/{stringLobbyId}")
    public String taskFinished(TaskFinished message){
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());
        if (lobby == null) {
            return null;
        }

        Task task = lobby.getPlayersTask(message.getPlayerId()).getTask(message.getTaskId());
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
                totalNumberOfTasks++;

                if (task.getValue().getStatus() == TaskStatus.FINISHED){
                    finishedNumberOfTasks++;
                }
            }
        }

        messagingTemplate.convertAndSend("/subscribe/getProgress/" + lobbyId, "{\"progress\":"  + (double)finishedNumberOfTasks/totalNumberOfTasks +"}");

        if (finishedNumberOfTasks == totalNumberOfTasks){
            Rest.gameFinished(lobbyId);
            Lobbies.removeLobby(lobbyId);
        }
    }
}
