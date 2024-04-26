package taskManager.extern;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;
import taskManager.Lobbies;
import taskManager.Lobby;
import taskManager.TaskStatus;
import taskManager.extern.jsonDataTransferTypes.GetTasks;
import taskManager.extern.jsonDataTransferTypes.TaskFinished;
import taskManager.tasks.Task;

@RestController
public class TaskManagerController {

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

        return lobby.toString();
    }
}
