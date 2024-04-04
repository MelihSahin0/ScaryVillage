package playerManager.jsonDataTransferTypes;

import java.util.Arrays;

public class PlayerMoved {

    private String lobbyId = "";
    private String playerId = "";
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
                ", \"movement\": \"" + Arrays.toString(movement) + "\"" +
                '}';
    }
}
