package playerManager;

import java.util.ArrayList;
import java.util.List;

public class Lobby {

    private List<Player> players = new ArrayList<>();

    public List<Player> getPlayers() {
        return players;
    }

    public void addPlayers(Player _player) {
        this.players.add(_player);
    }
}
