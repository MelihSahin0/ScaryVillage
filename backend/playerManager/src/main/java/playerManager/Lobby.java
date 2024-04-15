package playerManager;

import java.util.HashMap;

public class Lobby {

    private final HashMap<String, Player> players = new HashMap<>();

    public HashMap<String, Player> getPlayers() {
        return players;
    }

    public Player getPlayer(String playerId) {
        return players.get(playerId);
    }

    public void addPlayer(Player player) {
        this.players.put(player.getId(), player);
    }
}
