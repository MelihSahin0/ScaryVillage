package taskManager.tasks;

import taskManager.TaskDifficulty;
import taskManager.TaskStatus;

public interface Task {

    public String getTaskId();
    public TaskDifficulty getDifficulty();
    public void setStatus(TaskStatus status);
    public TaskStatus getStatus();
    public int targetId();
    public void setTargetId(int targetId);
}
