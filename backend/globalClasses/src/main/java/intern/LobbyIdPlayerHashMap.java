package intern;

import java.util.HashMap;
import extern.Player;

public class LobbyIdPlayerHashMap {

    private String lobbyId;
    private HashMap<String, Player> players;

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
}
