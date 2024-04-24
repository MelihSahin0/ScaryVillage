package lobbyManager.extern.jsonDataTransferTypes;

public class ChangeKillCooldown {

    private int killCooldownTime;
    private String lobbyId;

    public int getKillCooldownTime() {
        return killCooldownTime;
    }

    public void setKillCooldownTime(int killCooldownTime) {
        this.killCooldownTime = killCooldownTime;
    }

    public String getLobbyId() {
        return lobbyId;
    }

    public void setLobbyId(String lobbyId) {
        this.lobbyId = lobbyId;
    }

    @Override
    public String toString() {
        return "{" +
                "\"killCooldownTime\": \"" + killCooldownTime + "\"" +
                "\"lobbyId\": \"" + lobbyId + "\"" +
                "}";
    }
}
