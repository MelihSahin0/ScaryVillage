package lobbyManager.extern.jsonDataTransferTypes;


public class KillOne {
    private String lobbyId;
    private boolean killOne;

    public String getLobbyId() {
        return lobbyId;
    }

    public void setLobbyId(String lobbyId) {
        this.lobbyId = lobbyId;
    }

    public boolean getKillOne() {
        return killOne;
    }

    public void setKillOne(boolean killOne) {
        this.killOne = killOne;
    }

    @Override
    public String toString() {
        return "{" +
                "\"lobbyId\": \"" + lobbyId + "\"" +
                ", \"killOne: \"" + killOne + "\"" +
                '}';
    }
}
