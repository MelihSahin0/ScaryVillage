package lobbyManager;

import extern.enumarators.Colors;
import extern.enumarators.Roles;

public class Player {

    private String id;
    private String name;
    private Colors color;
    private Roles role;
    private boolean host;
    private int timeLeftInSeconds = 10;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Colors getColor() {
        return color;
    }

    public void setColor(Colors color) {
        this.color = color;
    }

    public Roles getRole() {
        return role;
    }

    public void setRole(Roles role) {
        this.role = role;
    }

    public boolean isHost() {
        return host;
    }

    public void setHost(boolean host) {
        this.host = host;
    }

    public int getTimeLeftInSeconds() {
        return timeLeftInSeconds;
    }

    public void setTimeLeftInSeconds(int timeLeftInSeconds) {
        this.timeLeftInSeconds = timeLeftInSeconds;
    }

    @Override
    public String toString() {
        return "{" +
                "\"id\": \"" + id + "\"" +
                ", \"name\": \"" + name + "\"" +
                ", \"color\": \"" + color + "\"" +
                ", \"role\": \"" + role + "\"" +
                ", \"host\": \"" + host + "\"" +
                '}';
    }
}
