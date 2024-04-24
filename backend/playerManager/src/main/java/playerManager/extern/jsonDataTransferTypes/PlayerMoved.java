package playerManager.extern.jsonDataTransferTypes;

import java.util.Arrays;

public class PlayerMoved {

    private String lobbyId = "";
    private String playerId = "";
    private double deltaTime = 0;
    private String[] movement;

    public String getLobbyId() {
        return lobbyId;
    }

    public void setLobbyId(String lobbyId) {
        this.lobbyId = lobbyId;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public double getDeltaTime() {
        return deltaTime;
    }

    public void setDeltaTime(double deltaTime) {
        this.deltaTime =  deltaTime;
    }

    public String[] getMovement() {
        return movement;
    }

    public void setMovement(String[] movement) {
        this.movement = movement;
    }

    @Override
    public String toString() {
        return "PlayerMoved{" +
                "\"lobbyId\": \"" + lobbyId + '\"' +
                ", \"playerId\": \"" + playerId + '\"' +
                ", \"deltaTime\": " + deltaTime  +
                ", \"movement\": \"" + Arrays.toString(movement) + "\"" +
                '}';
    }
}
