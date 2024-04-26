package lobbyManager;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.*;
import extern.enumarators.GameStatus;
import extern.enumarators.Roles;
import extern.enumarators.Visibility;
import lobbyManager.extern.LobbyController;
import lobbyManager.extern.jsonDataTransferTypes.RemovePlayer;

public class Lobby {

    private String lobbyId;
    private GameStatus gameStatus;
    private final HashMap<String, Player> players = new HashMap<>();
    private int maxNumberOfPlayers;
    private int maxImposter;
    private int votingTime;
    private int killCooldownTime;
    private int bellCooldownTime;
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

    public int getMaxImposter() {
        return maxImposter;
    }

    public void setMaxImposter(int maxImposter) {

        maxImposter = Math.max(maxImposter, 1);

        if (players.size() <= 5) {
            this.maxImposter = 1;
        } else if (players.size() <= 8) {
            this.maxImposter = Math.min(maxImposter, 2);
        } else if (players.size() <= 10) {
            this.maxImposter = Math.min(maxImposter, 3);
        } else {
            this.maxImposter = 1;
        }
    }

    public int getVotingTime() {
        return votingTime;
    }

    public void setVotingTime(int votingTime) {
        this.votingTime = votingTime;
    }

    public int getKillCooldownTime() {
        return killCooldownTime;
    }

    public void setKillCooldownTime(int killCooldownTime) {
        this.killCooldownTime = killCooldownTime;
    }

    public int getBellCooldownTime() {
        return bellCooldownTime;
    }

    public void setBellCooldownTime(int bellCooldownTime) {
        this.bellCooldownTime = bellCooldownTime;
    }

    public void startTimer() {
        if (executorService != null) {
            executorService.shutdown();
        }
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
        Player player = getPlayer(playerId);
        try {
            player.setTimeLeftInSeconds(10);
        } catch (Exception ignore) {}
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

    public void setImposters() {
        Random r = new Random();
        int currentNumberOfImposter = maxImposter;

        Player[] aPlayers = players.values().toArray(new Player[0]);
        while (currentNumberOfImposter != 0) {
            Player player = players.get(aPlayers[r.nextInt(0, players.size())].getId());

            if (player != null && player.getRole() != Roles.IMPOSTER){
                player.setRole(Roles.IMPOSTER);
                currentNumberOfImposter--;
            }
        }
    }

    public void setEveryoneCrewmate(){
        for (Player player : players.values()) {
            player.setRole(Roles.CREWMATE);
        }
    }

    @Override
    public String toString() {
        return "{" +
                "\"maxNumberOfPlayers\": \"" + maxNumberOfPlayers +"\"" +
                ", \"visibility\": \"" + visibility + "\"" +
                ", \"maxImposter\": \"" + maxImposter + "\"" +
                ", \"votingTime\": \"" + votingTime + "\"" +
                ", \"killCooldownTime\": \"" + killCooldownTime + "\"" +
                ", \"bellCooldownTime\": \"" + bellCooldownTime + "\"" +
                '}';
    }

}
