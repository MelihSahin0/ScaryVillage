package playerManager;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class Lobby {

    private HashMap<String, Player> players = new HashMap<>();

    public HashMap<String, Player> getPlayers() {
        return players;
    }

    public void addPlayers(Player player) {
        this.players.put(player.getId(), player);
    }
}
