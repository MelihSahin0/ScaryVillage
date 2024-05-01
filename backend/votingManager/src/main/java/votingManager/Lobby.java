package votingManager;

import votingManager.extern.VotingManagerController;
import votingManager.extern.jsonDataTransferTypes.VotingTime;

import java.util.HashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class Lobby {

    private String lobbyId;
    private final HashMap<String, Player> players = new HashMap<>();
    private ScheduledExecutorService executorService;
    private int timeLeft;
    private boolean killOne;
    private boolean changeVotingNumberVisibility;

    public String getLobbyId() {
        return lobbyId;
    }

    public void setLobbyId(String lobbyId) {
        this.lobbyId = lobbyId;
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

    public void setTimeLeft(int timeLeft) {
        this.timeLeft = timeLeft;
    }

    public boolean getKillOne() {
        return killOne;
    }

    public void setKillOne(boolean killOne) {
        this.killOne = killOne;
    }

    public boolean getChangeVotingNumberVisibility() {
        return changeVotingNumberVisibility;
    }

    public void setChangeVotingNumberVisibility(boolean changeVotingNumberVisibility) {
        this.changeVotingNumberVisibility = changeVotingNumberVisibility;
    }

    public void startTimer() {
        if (executorService != null) {
            executorService.shutdown();
        }
        executorService = Executors.newSingleThreadScheduledExecutor();
        executorService.scheduleAtFixedRate(() -> {
            VotingManagerController votingManagerController = new VotingManagerController();
            VotingTime votingTime = new VotingTime();
            votingTime.setLobbyId(lobbyId);
            votingTime.setTimeLeft(timeLeft);
            votingManagerController.sendTime(votingTime);

            if (timeLeft != 0) {
                timeLeft--;
            } else {
                votingManagerController.sendResult(lobbyId);
                executorService.shutdown(); // Stop the timer
                Lobbies.removeLobby(lobbyId);
            try {
                executorService.awaitTermination(5, TimeUnit.SECONDS);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        }, 0, 1, TimeUnit.SECONDS);
    }
}
