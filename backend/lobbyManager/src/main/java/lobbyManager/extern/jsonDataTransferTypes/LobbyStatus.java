package lobbyManager.extern.jsonDataTransferTypes;


import extern.enumarators.GameStatus;

public class LobbyStatus {

    private String lobbyId = "";
    private GameStatus gameStatus;

    public String getLobbyId() {
        return lobbyId;
    }

    public void setLobbyId(String lobbyId) {
        this.lobbyId = lobbyId;
    }

    public GameStatus getGameStatus() {
        return gameStatus;
    }

    public void setGameStatus(String gameStatus) {
        this.gameStatus = GameStatus.getGameStatus(gameStatus);
    }

    @Override
    public String toString() {
        return "{" +
                "\"lobbyId\": \"" + lobbyId + "\"" +
                ", \"gameStatus\": \"" + gameStatus + "\"" +
                '}';
    }
}
