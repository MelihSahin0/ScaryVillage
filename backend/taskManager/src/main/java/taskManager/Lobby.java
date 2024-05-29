package taskManager;

import org.json.JSONObject;
import taskManager.intern.Rest;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class Lobby {

    private final HashMap<String, Tasks> playersTask = new HashMap<>();

    private Boolean[] sabotage = {false, false, false};

    public void setSabotage(int i, boolean bool) {
        sabotage[i] = bool;
        System.out.println(sabotage[0] +" "+ sabotage[1] +" "+ sabotage[2]);
    }

    public void checkSabotage(String lobbyId) {
        new Thread(() -> {
            try {
                Thread.sleep(30000); // time until sabotage gets checked
                boolean anySabotageActive = false;
                for (boolean sabotageState : sabotage) {
                    if (sabotageState) {
                        anySabotageActive = true;
                        break;
                    }
                }
                if (anySabotageActive) {
                    System.out.println("Sabotage detected!");
                    // TODO: make finishing call to frontend
                    Rest.gameFinished(lobbyId);
                    Lobbies.removeLobby(lobbyId);
                } else {
                    System.out.println("No sabotage detected.");
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.out.println("Thread was interrupted, failed to complete operation");
            }
        }).start();
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
