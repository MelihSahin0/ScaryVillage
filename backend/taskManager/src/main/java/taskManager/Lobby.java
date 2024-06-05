package taskManager;

import org.json.JSONObject;
import taskManager.extern.ApplicationContextHolder;
import taskManager.extern.TaskManagerController;
import taskManager.intern.Rest;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class Lobby {

    private final HashMap<String, Tasks> playersTask = new HashMap<>();

    private final Boolean[] sabotage = {false, false, false};

    private Boolean sabotageCooldown = false;

    public Boolean getSabotageCooldown() {return sabotageCooldown;}

    public void setSabotage(int i, boolean bool) {
        sabotage[i] = bool;
    }

    public void checkSabotage(String lobbyId) {
        new Thread(() -> {
            try {
                sabotageCooldown = true;
                TaskManagerController taskManagerController = ApplicationContextHolder.getContext().getBean(TaskManagerController.class);
                taskManagerController.sendCooldown(lobbyId, true);
                Thread.sleep(30000); // time until sabotage gets checked
                boolean anySabotageActive = false;
                for (boolean sabotageState : sabotage) {
                    if (sabotageState) {
                        anySabotageActive = true;
                        break;
                    }
                }
                if (anySabotageActive) {
                    taskManagerController.sendCooldown(lobbyId, null);
                    Rest.gameFinished(lobbyId);
                    Lobbies.removeLobby(lobbyId);
                } else {
                    Thread.sleep(30000);
                    sabotageCooldown = false;
                    taskManagerController.sendCooldown(lobbyId, false);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
    }

    public Boolean getActiveSabotage() {
        boolean anySabotageActive = false;
        for (boolean sabotageState : sabotage) {
            if (sabotageState) {
                anySabotageActive = true;
                break;
            }
        }
        return anySabotageActive;
    }

    public void setPlayersTask(String playerId, Tasks task){
        playersTask.put(playerId, task);
    }

    public Tasks getPlayersTask(String playerId) {
        return playersTask.get(playerId);
    }

    public Set<Map.Entry<String, Tasks>> getPlayerTasks(){
        return playersTask.entrySet();
    }

    @Override
    public String toString() {
        JSONObject jsonObject = new JSONObject();
        for (Map.Entry<String, Tasks> entry : playersTask.entrySet()) {
            jsonObject.put(entry.getKey(), entry.getValue().toString());
        }
        return jsonObject.toString();
    }
}
