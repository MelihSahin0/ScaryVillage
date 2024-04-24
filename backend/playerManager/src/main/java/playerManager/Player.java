package playerManager;

import extern.enumarators.Colors;
import extern.enumarators.Roles;
import playerManager.extern.PlayerManagerController;
import playerManager.extern.jsonDataTransferTypes.KillCooldown;

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

    Map m = new Map();

    public Player(String id, String name, Colors color, int x, int y, Roles role, int killCooldown) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.x = x;
        this.y = y;
        this.speed = 1;
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

    public void initiateMove(String[] stringArray, double deltaTime) {

        double diagonalFac = 1;
        if (stringArray.length > 1) {
            diagonalFac = 0.7071;
        }

        for (String str : stringArray) {
            switch (str) {
                case "w":
                    move(0, 1, diagonalFac, deltaTime);
                    break;
                case "s":
                    move(0, -1, diagonalFac, deltaTime);
                    break;
                case "a":
                    move(-1, 0, diagonalFac, deltaTime);
                    break;
                case "d":
                    move(1, 0, diagonalFac, deltaTime);
                    break;
            }
        }
    }

    public void move(int dx, int dy, double diagonalFactor, double deltaTime) {
         if (isMoveable(dx, dy, diagonalFactor, deltaTime)) {
            double newX = x + dx * speed * diagonalFactor * deltaTime;
            double newY = y + dy * speed * diagonalFactor * deltaTime;

            // Check collision with walls
            if (!isCollidingWithWalls(newX, newY)) {
                x = newX;
                y = newY;
            }
        }
    }

    public boolean isMoveable(int dx, int dy, double diagonalFactor, double deltaTime) {

        //World border
        if (y + (dy * speed * diagonalFactor * deltaTime) > 2) {
            return false;
        } else if (y + (dy * speed * diagonalFactor * deltaTime) < -2.2) {
            return false;
        } else if (x + (dx * speed * diagonalFactor * deltaTime) > 4) {
            return false;
        } else if (x + (dx * speed * diagonalFactor * deltaTime) < -3.8) {
            return false;
        }

        System.out.println(x + " " + y);

        return true;
    }

    private boolean isCollidingWithWalls(double newX, double newY) {
        for (Wall wall : Map.getWalls()) {

            // Check collision with left side
            if (newX >= wall.getStartX() && newX <= wall.getStartX() + 0.01 && // Add a small tolerance for precision issues
                    newY >= Math.min(wall.getStartY(), wall.getEndY()) &&
                    newY <= Math.max(wall.getStartY(), wall.getEndY())) {
                return true;
            }

            // Check collision with right side
            if (newX <= wall.getEndX() && newX >= wall.getEndX() - 0.01 && // Add a small tolerance for precision issues
                    newY >= Math.min(wall.getStartY(), wall.getEndY()) &&
                    newY <= Math.max(wall.getStartY(), wall.getEndY())) {
                return true;
            }

            // Check collision with top side
            if (newY >= wall.getStartY() && newY <= wall.getStartY() + 0.01 && // Add a small tolerance for precision issues
                    newX >= Math.min(wall.getStartX(), wall.getEndX()) &&
                    newX <= Math.max(wall.getStartX(), wall.getEndX())) {
                return true;
            }

            // Check collision with bottom side
            if (newY <= wall.getEndY() && newY >= wall.getEndY() - 0.01 && // Add a small tolerance for precision issues
                    newX >= Math.min(wall.getStartX(), wall.getEndX()) &&
                    newX <= Math.max(wall.getStartX(), wall.getEndX())) {
                return true;
            }
        }
        return false;
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
