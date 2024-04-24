package lobbyManager.extern.jsonDataTransferTypes;

public class ChangeBellCooldown {
    private String lobbyId;
    private int bellCooldownTime;

    public String getLobbyId() {
        return lobbyId;
    }

    public void setLobbyId(String lobbyId) {
        this.lobbyId = lobbyId;
    }

    public int getBellCooldownTime() {
        return bellCooldownTime;
    }

    public void setBellCooldownTime(int bellCooldownTime) {
        this.bellCooldownTime = bellCooldownTime;
    }

    @Override
    public String toString() {
        return "{" +
                "\"lobbyId\": \"" + lobbyId + "\"" +
                "\" bellCooldownTime\": \"" + bellCooldownTime + "\"" +
                "}";
    }
}
