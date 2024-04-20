package votingManager.extern.jsonDataTransferTypes;

public class VotingTime {
    private String lobbyId;
    private int timeLeft;

    public String getLobbyId() {
        return lobbyId;
    }

    public void setLobbyId(String lobbyId) {
        this.lobbyId = lobbyId;
    }

    public int getTimeLeft() {
        return timeLeft;
    }

    public void setTimeLeft(int timeLeft) {
        this.timeLeft = timeLeft;
    }

    @Override
    public String toString() {
        return "{" +
                "\"lobbyId\": \"" + lobbyId + "\"" +
                ", \"timeLeft\": \"" + timeLeft + "\"" +
                '}';
    }
}
