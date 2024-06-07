package lobbyManager;

public class Message {

    private final boolean wasAlive;
    private String playerName;
    private final String message;

    public Message(boolean wasAlive, String playerName, String message) {
        this.wasAlive = wasAlive;
        this.playerName = playerName;
        this.message = message;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public String getMessage() {
        return message;
    }

    public boolean isWasAlive() {
        return wasAlive;
    }

    @Override
    public String toString() {
        return "{" +
                "\"wasAlive\": \"" + wasAlive + "\"" +
                ",\"playerName\": \"" + playerName + '\"' +
                ", \"message\": \"" + message + '\"' +
                '}';
    }
}
