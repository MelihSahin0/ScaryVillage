package playerManager;

import playerManager.extern.PlayerManagerController;
import playerManager.extern.jsonDataTransferTypes.BellCooldown;

import java.util.HashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class Lobby {

    private final HashMap<String, Player> players = new HashMap<>();
    private final int bellCooldown;
    private int allowedToBellIn;
    private int votingTime;
    private ScheduledExecutorService executorServiceKillCooldown;

    public Lobby(int bellCooldown) {
        this.bellCooldown = bellCooldown;
    }

    public HashMap<String, Player> getPlayers() {
        return players;
    }

    public Player getPlayer(String playerId) {
        return players.get(playerId);
    }

    public void addPlayer(Player player) {
        this.players.put(player.getId(), player);
    }

    public int getBellCooldown() {
        return bellCooldown;
    }

    public int getVotingTime() {
        return votingTime;
    }

    public void setVotingTime(int votingTime) {
        this.votingTime = votingTime;
    }

    public int getAllowedToBellIn() {
        return allowedToBellIn;
    }

    public void startBellCooldown(String lobbyId, int cooldownOffset) {
        if (executorServiceKillCooldown != null) {
            executorServiceKillCooldown.shutdown();
        }
        allowedToBellIn = bellCooldown + cooldownOffset;
        executorServiceKillCooldown = Executors.newSingleThreadScheduledExecutor();
        executorServiceKillCooldown.scheduleAtFixedRate(() -> {
            if (allowedToBellIn > 0) {
                allowedToBellIn--;
                BellCooldown message = new BellCooldown();
                message.setLobbyId(lobbyId);
                message.setBellCooldown(allowedToBellIn);
                PlayerManagerController playerManagerController = new PlayerManagerController();
                playerManagerController.bellCooldown(message);
            } else {
                executorServiceKillCooldown.shutdown();
                try {
                    executorServiceKillCooldown.awaitTermination(5, TimeUnit.SECONDS);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        }, 0, 1, TimeUnit.SECONDS);
    }

}
