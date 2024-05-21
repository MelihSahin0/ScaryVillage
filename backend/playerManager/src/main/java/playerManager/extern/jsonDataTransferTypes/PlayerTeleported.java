package playerManager.extern.jsonDataTransferTypes;

public class PlayerTeleported {

    private String lobbyId = "";
    private String playerId = "";
    private int sewerFrom;
    private double playerX;
    private double playerY;


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

    public int getSewerFrom() {
        return sewerFrom;
    }

    public void setSewerFrom(int sewerFrom) {
        this.sewerFrom = sewerFrom;
    }

    public double getPlayerX() {
        return playerX;
    }

    public void setPlayerX(double playerX) {
        this.playerX = playerX;
    }

    public double getPlayerY() {
        return playerY;
    }

    public void setPlayerY(double playerY) {
        this.playerY = playerY;
    }

    @Override
    public String toString() {
        return "PlayerTeleported{" +
                "lobbyId='" + lobbyId + '\'' +
                ", playerId='" + playerId + '\'' +
                ", sewerFrom=" + sewerFrom +
                ", playerX=" + playerX +
                ", playerY=" + playerY +
                '}';
    }
}
