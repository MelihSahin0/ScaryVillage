package taskManager.intern;

import extern.enumarators.Roles;
import intern.Player;
import taskManager.Lobby;
import taskManager.TaskStatus;
import taskManager.Tasks;
import taskManager.VillageMeshesDTO;
import taskManager.tasks.Bin;
import taskManager.tasks.Task;

import java.util.*;

public class Utility {

    public void setPlayersTask(Lobby lobby, VillageMeshesDTO villageMeshesDTO, HashMap<String, Player> players){
        for ( Map.Entry<String, Player> player : players.entrySet()){
            if (player.getValue().getRole() == Roles.CREWMATE) {
                Tasks tasks = new Tasks();

                List<Task> availableTasks = new ArrayList<>();
                availableTasks.addAll(villageMeshesDTO.getBin());
                availableTasks.addAll(villageMeshesDTO.getCooking());
                availableTasks.addAll(villageMeshesDTO.getSleeping());
                setTasks(tasks, availableTasks, 3);
                availableTasks = new ArrayList<>();
                availableTasks.addAll(villageMeshesDTO.getMining());
                availableTasks.addAll(villageMeshesDTO.getChopping());
                setTasks(tasks, availableTasks, 2);
                availableTasks = new ArrayList<>();
                availableTasks.addAll(villageMeshesDTO.getFishing());
                availableTasks.addAll(villageMeshesDTO.getChicken());
                setTasks(tasks, availableTasks, 1);

                if (tasks.getTasks().stream().anyMatch(option -> option.getValue() instanceof Bin)){
                    Task task = villageMeshesDTO.getCave().deepCopy();
                    task.setStatus(TaskStatus.TODO);
                    String uuid = UUID.randomUUID().toString().replace("-", "");
                    task.setTaskId(uuid);
                    tasks.addTask(uuid, villageMeshesDTO.getCave());
                }
                lobby.setPlayersTask(player.getKey(), tasks);
            }
        }
    }

    private void setTasks(Tasks tasks, List<Task> availableTasks, int numberOfTasks){
        for (int i = 0; i < numberOfTasks; i++) {
            String uuid;
            Task task;
            do {
                uuid = UUID.randomUUID().toString().replace("-", "");
                Random r = new Random();
                Task candidate = availableTasks.get(r.nextInt(availableTasks.size())).deepCopy();
                if (tasks.getTasks().stream().anyMatch(option -> option.getValue().getPosition().equals(candidate.getPosition()))) {
                    task = null;
                } else {
                    candidate.setTaskId(uuid);
                    candidate.setStatus(TaskStatus.TODO);
                    task = candidate;
                }
            } while (task == null);
            tasks.addTask(uuid, task);
        }
    }
}
