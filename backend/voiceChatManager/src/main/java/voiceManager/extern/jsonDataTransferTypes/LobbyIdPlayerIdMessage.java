package voiceManager.extern.jsonDataTransferTypes;

public class LobbyIdPlayerIdMessage {
    private String lobbyId;
    private String playerId;
    private String type;
    private String sdp;
    private String candidate;

    public String getLobbyId() {
        return lobbyId;
    }

    public void setLobbyId(String lobbyId) {
        this.lobbyId = lobbyId;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public String  getSdp() {
        return sdp;
    }

    public void setSdp(String sdp) {
        this.sdp = sdp;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCandidate() {
        return candidate;
    }

    public void setCandidate(String candidate) {
        this.candidate = candidate;
    }

    @Override
    public String toString() {
        return "{" +
                "\"lobbyId\": \"" + lobbyId + '\"' +
                ", \"playerId\": \"" + playerId + '\"' +
                ", \"type\": \"" + type + '\"' +
                ", \"sdp\": \"" + sdp + '\"' +
                ", \"candidate\": \"" + candidate + '\"' +
                '}';
    }
}
