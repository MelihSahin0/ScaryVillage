package lobbyManager.extern.jsonDataTransferTypes;

public class ChangeVotingTime {
    private String lobbyId;
    private int VotingTime;

    public String getLobbyId() {
        return lobbyId;
    }

    public void setLobbyId(String lobbyId) {
        this.lobbyId = lobbyId;
    }

    public int getVotingTime() {
        return VotingTime;
    }

    public void setVotingTime(int votingTime) {
        VotingTime = votingTime;
    }

    @Override
    public String toString() {
        return "{" +
                "\"lobbyId\": \"" + lobbyId + "\"" +
                "\" VotingTime\": \"" + VotingTime + "\"" +
                "}";
    }
}
