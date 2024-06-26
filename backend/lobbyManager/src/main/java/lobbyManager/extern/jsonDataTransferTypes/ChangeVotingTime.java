package lobbyManager.extern.jsonDataTransferTypes;

public class ChangeVotingTime {
    private String lobbyId;
    private int votingTime;

    public String getLobbyId() {
        return lobbyId;
    }

    public void setLobbyId(String lobbyId) {
        this.lobbyId = lobbyId;
    }

    public int getVotingTime() {
        return votingTime;
    }

    public void setVotingTime(int votingTime) {
        this.votingTime = votingTime;
    }

    @Override
    public String toString() {
        return "{" +
                "\"lobbyId\": \"" + lobbyId + "\"" +
                "\" votingTime\": \"" + votingTime + "\"" +
                "}";
    }
}
