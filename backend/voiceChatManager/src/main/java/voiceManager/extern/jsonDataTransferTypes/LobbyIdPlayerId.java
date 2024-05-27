package voiceManager.extern.jsonDataTransferTypes;

public class LobbyIdPlayerId {
    private String lobbyId;
    private String playerId;

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

    @Override
    public String toString() {
        return "{" +
                "\"lobbyId\": \"" + lobbyId + '\"' +
                ", \"playerId\": \"" + playerId + '\"' +
                '}';
    }
}
