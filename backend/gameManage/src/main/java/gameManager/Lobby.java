package gameManager;

import lobbyManager.enumarators.GameStatus;

public class LobbyShortened {

    private GameStatus gameStatus;
    private int numberOfPlayers;

    public GameStatus getGameStatus() {
        return gameStatus;
    }

    public void setGameStatus(GameStatus gameStatus) {
        this.gameStatus = gameStatus;
    }

    public int getNumberOfPlayers() {
        return numberOfPlayers;
    }

    public void setNumberOfPlayers(int numberOfPlayers) {
        this.numberOfPlayers = numberOfPlayers;
    }

    @Override
    public String toString() {
        return "{" +
                " \" + gameStatus: \"" + gameStatus + "\"" +
                ", \"numberOfPlayers: \"" + numberOfPlayers + "\"" +
                '}';
    }
}
