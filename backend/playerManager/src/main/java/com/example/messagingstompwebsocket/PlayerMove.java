package com.example.messagingstompwebsocket;

public class PlayerMove {

    private int id;
    private String[] movement;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String[] getMovement() {
        return movement;
    }

    public void setMovement(String[] movement) {
        this.movement = movement;
    }
}
