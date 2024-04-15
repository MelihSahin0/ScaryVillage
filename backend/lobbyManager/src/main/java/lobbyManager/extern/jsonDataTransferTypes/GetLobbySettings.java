package lobbyManager.extern.jsonDataTransferTypes;

public class GetLobbySettings {

    private String lobbyId;

    public String getLobbyId() {
        return lobbyId;
    }

    public void setLobbyId(String lobbyId) {
        this.lobbyId = lobbyId;
    }

    @Override
    public String toString() {
        return "{" +
                "\"lobbyId\": \"" + lobbyId + "\"" +
                "}";
    }
}
