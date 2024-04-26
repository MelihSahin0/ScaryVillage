package taskManager;

import org.json.JSONArray;
import taskManager.tasks.Task;
import java.util.HashMap;
import java.util.Map;

public class Tasks {

    private HashMap<String, Task> tasks = new HashMap<>();

    public Task getTask(String taskId){
        return tasks.get(taskId);
    }

    public void addTask(String taskId,Task task){
        tasks.put(taskId, task);
    }

    public int getNumberOfTaskType(Class<? extends Task> taskClass){
        int numberOfTasks = 0;
        for(Task task : tasks.values()){
            if (taskClass.isAssignableFrom(task.getClass())){
                numberOfTasks++;
            }
        }
        return numberOfTasks;
    }

    public java.util.Set<Map.Entry<String, Task>> getTasks(){
        return tasks.entrySet();
    }

    @Override
    public String toString() {
        JSONArray jsonArray = new JSONArray();
        for (Task task : tasks.values()) {
            if (task.getStatus() == TaskStatus.TODO) {
                jsonArray.put(task.toString());
            }
        }
        return jsonArray.toString();
    }
}
