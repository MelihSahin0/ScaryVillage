package taskManager;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class Lobby {

    private final HashMap<String, Tasks> playersTask = new HashMap<>();

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
