package taskManager.extern.jsonDataTransferTypes;

public class TaskFinished {

    private String lobbyId;
    private String playerId;
    private String taskId;

    public String getLobbyId() {
        return lobbyId;
    }

    public void setLobbyId(String lobbyId) {
        this.lobbyId = lobbyId;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    @Override
    public String toString() {
        return "{" +
                "\"lobbyId\": \"" + lobbyId + '\"' +
                ", \"playerId\": \"" + playerId + '\"' +
                ", \"taskId\": \"" + taskId + '\"' +
                '}';
    }
}
