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
    private int numberOfImposter;
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
        this.maxImposter = maxImposter;
    }

    public int getNumberOfImposter(){
        return numberOfImposter;
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

    public int random(int size){
        Random random = new Random();
        return random.nextInt(size);
    }

    public void setImposters() {
        if ((players.values().size() >= 2 && players.values().size() <= 5) || (players.values().size() >= 2 && maxImposter ==1)) {
            int i = random(players.values().size() +1);
            int x = 0;
            for (Player p : players.values()) {
                p.setRole(Roles.CREWMATE);
                if (x == i){
                    p.setRole(Roles.IMPOSTER);
                }
                x++;
            }
            numberOfImposter = 1;
        }
        if ((players.values().size() >= 6 && players.values().size() < 9) || (players.values().size() >= 6 && maxImposter ==2)) {
            int i = random(players.values().size()+1);
            int j = random(players.values().size()+1);
            int x = 0;
            int y = 0;
            for (Player p : players.values()) {
                p.setRole(Roles.CREWMATE);
                if (x == i || j == y){
                    p.setRole(Roles.IMPOSTER);
                }
                x++;
                y++;
            }
            numberOfImposter = 2;
        }
        if (players.values().size() >= 9 && maxImposter == 3) {
            int i = random(players.values().size() + 1);
            int j = random(players.values().size() + 1);
            int k = random(players.values().size() + 1);
            System.out.println(j + "hallo");
            System.out.println(i + "i");
            System.out.println(k + "k");
            int x = 0;
            int y = 0;
            int z = 0;
            for (Player p : players.values()) {
                p.setRole(Roles.CREWMATE);
                if (i == x || j == y || k == z) {
                    p.setRole(Roles.IMPOSTER);
                }
                x++;
                y++;
                z++;
            }
            numberOfImposter = 3;
        }
    }

    @Override
    public String toString() {
        return "{" +
                "\"maxNumberOfPlayers\": \"" + maxNumberOfPlayers +"\"" +
                ", \"visibility\": \"" + visibility + "\"" +
                ", \"numberOfImposter\": \"" + numberOfImposter +"\"" +
                '}';
    }

}
