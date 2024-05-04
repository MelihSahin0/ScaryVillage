package taskManager;

import org.json.JSONArray;
import taskManager.tasks.Task;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class Tasks {

    private final HashMap<String, Task> tasks = new HashMap<>();

    public Task getTask(String taskId){
        return tasks.get(taskId);
    }

    public Set<Map.Entry<String, Task>> getTasks(){
        return tasks.entrySet();
    }

    public void addTask(String taskId,Task task){
        tasks.put(taskId, task);
    }

    @Override
    public String toString() {
        JSONArray jsonArray = new JSONArray();
        for (Task task : tasks.values()) {
            if (task.getStatus() == TaskStatus.TODO && task.getDifficulty() != TaskDifficulty.EXTENSION) {
                jsonArray.put(task.toString());
            }
        }
        return jsonArray.toString();
    }
}
