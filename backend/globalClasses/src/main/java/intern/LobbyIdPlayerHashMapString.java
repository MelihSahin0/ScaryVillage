package intern;

import java.util.HashMap;

public class LobbyIdPlayerHashMapString {

    private String lobbyId;
    private HashMap<String, Player> players = new HashMap<>();
    private String extra;
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

    public String getExtra() {
        return extra;
    }

    public void setExtra(String extra) {
        this.extra = extra;
    }

    public int getVotingTime() {
        return votingTime;
    }

    public void setVotingTime(int votingTime) {
        this.votingTime = votingTime;
    }
}
