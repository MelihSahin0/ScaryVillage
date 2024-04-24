package intern;

import java.util.HashMap;

public class LobbyIdPlayerHashMap {

    private String lobbyId;
    private HashMap<String, Player> players = new HashMap<>();
    private int bellCooldown;
    private int killCooldown;
    private int votingTime;

    public String getLobbyId() {
        return lobbyId;
    }

    public void setLobbyId(String lobbyId) {
        this.lobbyId = lobbyId;
    }

    public HashMap<String, Player> getPlayers() {
        return players;
    }

    public void setPlayers(HashMap<String, Player> players) {
        this.players = players;
    }

    public void setPlayer(String playerId, Player player) {this.players.put(playerId, player);}

    public int getBellCooldown() {
        return bellCooldown;
    }

    public void setBellCooldown(int bellCooldown) {
        this.bellCooldown = bellCooldown;
    }

    public int getKillCooldown() {
        return killCooldown;
    }

    public void setKillCooldown(int killCooldown) {
        this.killCooldown = killCooldown;
    }

    public int getVotingTime() {
        return votingTime;
    }

    public void setVotingTime(int votingTime) {
        this.votingTime = votingTime;
    }
}