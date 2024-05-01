package taskManager;

public enum TaskDifficulty {
    EASY(0),
    MEDIUM(1),
    HARD(2),
    REQUIRED(3),
    EXTENSION(4);

    private static final TaskDifficulty[] taskDifficulties = TaskDifficulty.values();
    private final int taskDifficulty;

    TaskDifficulty(int taskDifficulty) {
        this.taskDifficulty = taskDifficulty;
    }

    public static TaskDifficulty getTaskDifficulty(int i){
        return taskDifficulties[i];
    }

    @Override
    public String toString() {
        return String.valueOf(taskDifficulty);
    }


}
