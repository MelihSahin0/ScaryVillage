package intern;

import extern.Player;
import java.util.HashMap;


public class LobbyIdPlayerList {

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
