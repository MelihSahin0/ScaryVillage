package taskManager.tasks;

import taskManager.TaskDifficulty;
import taskManager.TaskStatus;

public class Bin implements Task {

    private final String taskId;
    private final TaskDifficulty difficulty = TaskDifficulty.EASY;
    private TaskStatus status = TaskStatus.TODO;
    private int targetId;

    public Bin(String taskId, int targetId) {
        this.taskId = taskId;
        this.targetId = targetId;
    }

    @Override
    public String getTaskId() {
        return taskId;
    }

    @Override
    public TaskDifficulty getDifficulty() {
        return difficulty;
    }

    @Override
    public TaskStatus getStatus() {
        return status;
    }

    @Override
    public void setStatus(TaskStatus status){
        this.status = status;
    }

    @Override
    public int targetId() {
        return 0;
    }

    @Override
    public void setTargetId(int targetId) {
        this.targetId = targetId;
    }


    @Override
    public String toString() {
        return "{" +
                "\"taskId\": \"" + taskId + "\"" +
                ", \"type\": \"" + this.getClass().getSimpleName() + "\"" +
                ", \"targetId\": " + targetId +
                "}";
    }
}
