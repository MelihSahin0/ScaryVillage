package playerManager.extern.jsonDataTransferTypes;

public class Voting {

    private String lobbyId = "";
    private String fromPlayerId = "";
    private String toPlayerId = "";
    private boolean endVoting = false;

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

    public boolean isEndVoting() {
        return endVoting;
    }

    public void setEndVoting(String endVoting) {
        this.endVoting = Boolean.parseBoolean(endVoting);
    }

    @Override
    public String toString() {
        return "{" +
                "\"lobbyId\": \"" + lobbyId + '\"' +
                ", \"fromPlayerId\": \"" + fromPlayerId + '\"' +
                ", \"toPlayerId\": \"" + toPlayerId + '\"' +
                ", \"endVoting\": \"" + endVoting + '\"' +
                '}';
    }
}
