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

    public void move(int dx, int dy) {
        _x += dx * _speed;
        _y += dy * _speed;
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
