package com.example.messagingstompwebsocket;

public class Player {
    private static int _idCounter;
    private int _id;
    private String _name;
    private int _x;
    private int _y;
    private final int _speed;

    public Player(String name, int x, int y) {
        _id = _idCounter++;
        _name = name;
        _x = x;
        _y = y;
        _speed = 5;
    }

    public void move(int dx, int dy) {
        _x += dx * _speed;
        _y += dy * _speed;
        //System.out.println(dx + " " + dy);
    }

    public int getId() {
        return _id;
    }
    public int getX() {
        return _x;
    }

    public int getY() {
        return _y;
    }
}
