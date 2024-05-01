package lobbyManager.extern.jsonDataTransferTypes;

public class ChangeVotingNumberVisibility {
    private String lobbyId;
    private boolean changeVotingNumberVisibility;

    public String getLobbyId() {
        return lobbyId;
    }

    public void setLobbyId(String lobbyId) {
        this.lobbyId = lobbyId;
    }

    public boolean getChangeVotingNumberVisibility() {
        return changeVotingNumberVisibility;
    }

    public void setChangeVotingNumberVisibility(boolean changeVotingNumberVisibility) {
        this.changeVotingNumberVisibility = changeVotingNumberVisibility;
    }
}
