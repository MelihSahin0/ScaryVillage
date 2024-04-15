package Shared;

import java.util.HashMap;

import lobbyManager.Player;
import lobbyManager.enumarators.GameStatus;

public class Lobby {

    private GameStatus gameStatus;
    private final HashMap<String, Player> players = new HashMap<>();

    public GameStatus getGameStatus() {
        return gameStatus;
    }

    public void setGameStatus(GameStatus gameStatus) {
        this.gameStatus = gameStatus;
    }

    public HashMap<String, Player> getPlayers() {
        return players;
    }

    public void addPlayers(Player player) {
        this.players.put(player.getId(), player);
    }
}
