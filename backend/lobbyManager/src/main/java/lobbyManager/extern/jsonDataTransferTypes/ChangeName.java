package lobbyManager.jsonDataTransferTypes;

public class ChangeName {

    private String playerId = "";
    private String lobbyId = "";
    private String name = "";

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "{" +
                "\"playerId\": \"" + playerId + "\"" +
                ", \"lobbyId\": \"" + lobbyId + "\"" +
                ", \"name\": \"" + name + "\"" +
                '}';
    }
}
