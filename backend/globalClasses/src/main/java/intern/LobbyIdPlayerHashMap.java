package intern;

import java.util.HashMap;

public class LobbyIdPlayerHashMap {

    private String lobbyId;
    private HashMap<String, Player> players = new HashMap<>();

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
}