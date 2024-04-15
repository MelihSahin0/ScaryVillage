package lobbyManager;

import java.util.HashMap;
import java.util.Map;

public class Lobbies {

    private static final HashMap<String, Lobby> lobbies = new HashMap<>();

    public static void addLobby(String lobbyId){
        lobbies.put(lobbyId, new Lobby());
    }

    public static void removeLobby(String lobbyId){
        lobbies.remove(lobbyId);
    }

    public static Lobby getLobby(String lobbyId){
        return lobbies.get(lobbyId);
    }

    public static java.util.Set<Map.Entry<String, Lobby>> getLobbies(){
        return lobbies.entrySet();
    }
}
