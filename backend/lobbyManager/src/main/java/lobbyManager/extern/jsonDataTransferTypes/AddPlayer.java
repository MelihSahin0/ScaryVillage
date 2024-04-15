package lobbyManager.extern.jsonDataTransferTypes;

import org.springframework.messaging.handler.annotation.DestinationVariable;

public class AddPlayer {

    private String playerId = "";
    private String lobbyId = "";

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public String getLobbyId() {
        return lobbyId;
    }

    public void setLobbyId(String lobbyId) {
        this.lobbyId = lobbyId;
    }

    @Override
    public String toString() {
        return "{" +
                "\"playerId\": \"" + playerId + "\"" +
                ", \"lobbyId\": \"" + lobbyId + "\"" +
                '}';
    }
}
