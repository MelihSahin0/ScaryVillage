package playerManager.extern.jsonDataTransferTypes;

public class BellCooldown {
    private String lobbyId;
    private int bellCooldown;

    public int getBellCooldown() {
        return bellCooldown;
    }

    public void setBellCooldown(int bellCooldown) {
        this.bellCooldown = bellCooldown;
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
                "\"bellCooldown\": \"" + bellCooldown + "\"" +
                ", \"lobbyId\": \"" + lobbyId + "\"" +
                '}';
    }
}
