package lobbyManager;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.*;
import java.util.concurrent.Executors;
import extern.Player;
import extern.enumarators.GameStatus;
import extern.enumarators.Visibility;
import lobbyManager.extern.LobbyController;
import lobbyManager.extern.jsonDataTransferTypes.RemovePlayer;

public class Lobby {

    private String lobbyId;
    private GameStatus gameStatus;
    private final HashMap<String, Player> players = new HashMap<>();
    private int maxNumberOfPlayers;
    private Visibility visibility;
    private ScheduledExecutorService executorService;

    public String getLobbyId() {
        return lobbyId;
    }

    public void setLobbyId(String lobbyId) {
        this.lobbyId = lobbyId;
    }

    public GameStatus getGameStatus() {
        return gameStatus;
    }

    public void setGameStatus(GameStatus gameStatus) {
        this.gameStatus = gameStatus;
    }

    public Player getPlayer(String playerId){
        return players.get(playerId);
    }

    public HashMap<String, Player> getPlayers() {
        return players;
    }

    public void removePlayer(String playerId) {
        players.remove(playerId);
    }

    public void addPlayer(String playerId, Player player) {
        this.players.put(playerId, player);
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

    public void startTimer() {
        executorService = Executors.newSingleThreadScheduledExecutor();
        executorService.scheduleAtFixedRate(() -> {
            for(Map.Entry<String, Player> player : players.entrySet()) {
                if (player != null) {
                    int timeLeft = player.getValue().getTimeLeftInSeconds();
                    if (timeLeft > 0) {
                        player.getValue().setTimeLeftInSeconds(timeLeft - 1);
                    } else {
                        LobbyController lobbyController = new LobbyController();
                        RemovePlayer removePlayer = new RemovePlayer();
                        removePlayer.setLobbyId(lobbyId);
                        removePlayer.setPlayerId(player.getKey());
                        //Do it like this so the others know a player disconnected.
                        lobbyController.removePlayer(removePlayer);
                    }
                }
            }
        }, 0, 1, TimeUnit.SECONDS);
    }

    public void resetTimer(String playerId) {
        stopTimer();
        Player player = getPlayer(playerId);
        if (player != null) {
            player.setTimeLeftInSeconds(10);
        }
        startTimer();
    }

    public void stopTimer() {
        if (executorService != null) {
            executorService.shutdown(); // Stop the timer
            try {
                executorService.awaitTermination(5, TimeUnit.SECONDS);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public String toString() {
        return "{" +
                "\"maxNumberOfPlayers\": \"" + maxNumberOfPlayers +"\"" +
                ", \"visibility\": \"" + visibility + "\"" +
                '}';
    }
}
