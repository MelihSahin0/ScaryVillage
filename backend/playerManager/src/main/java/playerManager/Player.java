package playerManager;

import playerManager.enumarators.Roles;

public class Player {
    private String _id;
    private String _name;
    private double _x;
    private double _y;
    private final double _speed;
    private Roles _role;

    public Player(String id, String name, int x, int y, Roles role) {
        _id = id;
        _name = name;
        _x = x;
        _y = y;
        _speed = 0.01;
        _role = role;
    }

    public String getId() {
        return _id;
    }
    public double getX() {
        return _x;
    }
    public double getY() {
        return _y;
    }
    public Roles getRole() {
        return _role;
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
        _x += dx * _speed * diagonalFactor;
        _y += dy * _speed * diagonalFactor;
    }

    public void killed() {
        switch (_role) {
            case CREWMATE:
                _role = Roles.CREWMATEGHOST;
                break;
            case IMPOSTER:
                _role = Roles.IMPOSTERGHOST;
                break;
        }
    }

    @Override
    public String toString() {
        return "{" +
                "\"id\": \"" + _id + "\"" +
                ", \"position\": {" +
                                "\"x\": " + _x +
                                ", \"y\": " + _y +
                             "}" +
                ", \"role\": " + "\"" +_role + "\"" +
                '}';
    }
}
