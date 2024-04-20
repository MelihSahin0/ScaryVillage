package lobbyManager.extern.jsonDataTransferTypes;

public class ChangeNumberOfImpostor {
    private String lobbyId;
    private int numberOfImpostor;

    public String getLobbyId() {
        return lobbyId;
    }

    public void setLobbyId(String lobbyId) {
        this.lobbyId = lobbyId;
    }

    public int getNumberOfImpostor() {
        return numberOfImpostor;
    }

    public void setNumberOfImpostor(int numberOfImpostor) {
        this.numberOfImpostor = numberOfImpostor;
    }
}
