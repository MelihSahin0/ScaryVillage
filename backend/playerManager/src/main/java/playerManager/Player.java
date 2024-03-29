package playerManager;

public class Player {
    private static int _idCounter;
    private int _id;
    private String _name;
    private double _x;
    private double _y;
    private final double _speed;

    public Player(String name, int x, int y) {
        _id = _idCounter++;
        _name = name;
        _x = x;
        _y = y;
        _speed = 0.1;
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

    public int getId() {
        return _id;
    }
    public double getX() {
        return _x;
    }
    public double getY() {
        return _y;
    }

    @Override
    public String toString(){
        return "{\"id\": " + _id + ", \"position\": {\"x\": " + _x + ", \"y\": " + _y + "}}";
    }
}
