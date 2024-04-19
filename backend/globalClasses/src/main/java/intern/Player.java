package intern;

import extern.enumarators.Colors;
import extern.enumarators.Roles;

public class Player {

    private String id;
    private String name;
    private Colors color;
    private Roles role;

    public Player() {}

    public Player(String id, String name, Colors color, Roles role) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.role = role;
    }

    public Colors getColor() {
        return color;
    }

    public void setColor(Colors color) {
        this.color = color;
    }

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

    public Roles getRole() {
        return role;
    }

    public void setRole(Roles role) {
        this.role = role;
    }
}
