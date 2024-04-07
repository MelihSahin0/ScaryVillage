package playerManager.jsonDataTransferTypes;

import playerManager.enumarators.Colors;

public class ChangeColor {
    
    private String playerId = "";
    private String lobbyId = "";
    private Colors color = null;

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public String getLobbyId() {
        return lobbyId;
    }

    public void setLobbyId(String lobbyId) {
        this.lobbyId = lobbyId;
    }

    public Colors getColor() {
        return color;
    }

    public void setColor(int color) {
        this.color = Colors.getColor(color);
    }

    @Override
    public String toString() {
        return "{" +
                "\"playerId\": \"" + playerId + "\"" +
                ", \"lobbyId\": \"" + lobbyId + "\"" +
                ", \"color\": \"" + color.toString() + "\"" +
                '}';
    }
}
