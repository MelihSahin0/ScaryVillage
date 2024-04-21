package playerManager.extern.jsonDataTransferTypes;

public class KillCooldown {
    private String lobbyId;
    private int killCooldown;

    public int getKillCooldown() {
        return killCooldown;
    }

    public void setKillCooldown(int killCooldown) {
        this.killCooldown = killCooldown;
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
                "\"killCooldown\": \"" + killCooldown + "\"" +
                ", \"lobbyId\": \"" + lobbyId + "\"" +
                '}';
    }
}
