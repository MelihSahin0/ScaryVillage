package gameManager;

import extern.enumarators.GameStatus;
import extern.enumarators.Visibility;

public class Lobby {

    private GameStatus gameStatus = GameStatus.LOBBY;
    private int numberOfPlayers = 0;
    private int maxNumberOfPlayers = 10;
    private Visibility visibility = Visibility.PRIVATE;

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

    public int getMaxNumberOfPlayers() {
        return maxNumberOfPlayers;
    }

    public void setMaxNumberOfPlayers(int maxNumberOfPlayers) {
        this.maxNumberOfPlayers = maxNumberOfPlayers;
    }

    public Visibility getVisibility() {
        return visibility;
    }

    public void setVisibility(Visibility visibility) {
        this.visibility = visibility;
    }

    @Override
    public String toString() {
        return "{" +
                " \" + gameStatus: \"" + gameStatus + "\"" +
                ", \"numberOfPlayers: \"" + numberOfPlayers + "\"" +
                ", \"maxNumberOfPlayers: \"" + maxNumberOfPlayers + "\"" +
                ", \"visibility: \"" + visibility + "\"" +
                '}';
    }
}
