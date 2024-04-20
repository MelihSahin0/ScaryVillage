package votingManager.extern.jsonDataTransferTypes;

public class Voting {

    private String lobbyId = "";
    private String fromPlayerId = "";
    private String toPlayerId = "";

    public String getLobbyId() {
        return lobbyId;
    }

    public void setLobbyId(String lobbyId) {
        this.lobbyId = lobbyId;
    }

    public String getFromPlayerId() {
        return fromPlayerId;
    }

    public void setFromPlayerId(String fromPlayerId) {
        this.fromPlayerId = fromPlayerId;
    }

    public String getToPlayerId() {
        return toPlayerId;
    }

    public void setToPlayerId(String toPlayerId) {
        this.toPlayerId = toPlayerId;
    }

    @Override
    public String toString() {
        return "{" +
                "\"lobbyId\": \"" + lobbyId + '\"' +
                ", \"fromPlayerId\": \"" + fromPlayerId + '\"' +
                ", \"toPlayerId\": \"" + toPlayerId + '\"' +
                '}';
    }
}
