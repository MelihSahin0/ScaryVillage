package playerManager;

import extern.enumarators.Colors;
import extern.enumarators.Roles;
import lobbyManager.extern.LobbyController;
import lobbyManager.extern.jsonDataTransferTypes.RemovePlayer;
import playerManager.extern.PlayerManagerController;
import playerManager.extern.jsonDataTransferTypes.KillCooldown;

import javax.swing.text.Position;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class Player {
    private final String id;
    private String name;
    private Colors color;
    private double x;
    private double y;
    private final double speed;
    private Roles role;
    private final int killCooldown;
    private int allowedToKillIn;

    private ScheduledExecutorService executorServiceKillCooldown;

    public Player(String id, String name, Colors color, int x, int y, Roles role, int killCooldown) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.x = x;
        this.y = y;
        this.speed = 0.01;
        this.role = role;
        this.killCooldown = killCooldown;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name){
        this.name = name;
    }

    public Colors getColor() {
        return color;
    }

    public void setColor(Colors color){
        this.color = color;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public double getSpeed() {
        return speed;
    }

    public Roles getRole() {
        return role;
    }

    public void setRole(Roles role) {
        this.role = role;
    }

    public int getAllowedToKillIn() {
        return allowedToKillIn;
    }

    public void initiateMove(String[] stringArray) {

        double diagonalFac = 1;
        if (stringArray.length > 1) {
            diagonalFac = 0.7071;
        }

        for (String str : stringArray) {
            switch (str) {
                case "w":
                    move(0, 1, diagonalFac);
                    break;
                case "s":
                    move(0, -1, diagonalFac);
                    break;
                case "a":
                    move(-1, 0, diagonalFac);
                    break;
                case "d":
                    move(1, 0, diagonalFac);
                    break;
            }
        }
    }

    public void move(int dx, int dy, double diagonalFactor) {
        x += dx * speed * diagonalFactor;
        y += dy * speed * diagonalFactor;
    }

    public void killed() {
        switch (role) {
            case CREWMATE:
                role = Roles.CREWMATEGHOST;
                break;
            case IMPOSTER:
                role = Roles.IMPOSTERGHOST;
                break;
        }
    }

    public void startKillCooldown(String lobbyId) {
        if (executorServiceKillCooldown != null) {
            executorServiceKillCooldown.shutdown();
        }
        allowedToKillIn = killCooldown;
        executorServiceKillCooldown = Executors.newSingleThreadScheduledExecutor();
        executorServiceKillCooldown.scheduleAtFixedRate(() -> {
            if (allowedToKillIn > 0) {
                allowedToKillIn--;
                KillCooldown message = new KillCooldown();
                message.setLobbyId(lobbyId);
                message.setKillCooldown(allowedToKillIn);
                PlayerManagerController playerManagerController = new PlayerManagerController();
                playerManagerController.killCooldown(message);
            } else {
                executorServiceKillCooldown.shutdown();
                try {
                    executorServiceKillCooldown.awaitTermination(5, TimeUnit.SECONDS);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        }, 0, 1, TimeUnit.SECONDS);
    }

    @Override
    public String toString() {
        return "{" +
                "\"id\": \"" + id + "\"" +
                ", \"name\": \"" + name + "\"" +
                ", \"color\": \"" + color.toString() + "\"" +
                ", \"position\": {" +
                                "\"x\": " + x +
                                ", \"y\": " + y +
                             "}" +
                ", \"role\": " + "\"" + role + "\"" +
                '}';
    }
}
