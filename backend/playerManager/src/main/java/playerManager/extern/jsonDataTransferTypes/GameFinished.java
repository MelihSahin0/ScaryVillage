package playerManager.extern.jsonDataTransferTypes;

public class GameFinished {
    private boolean gameFinished;

    public boolean isGameFinished() {
        return gameFinished;
    }

    public void setGameFinished(boolean gameFinished) {
        this.gameFinished = gameFinished;
    }

    @Override
    public String toString() {
        return "{" +
                "\"gameFinished\": " + gameFinished +
                "}";
    }
}
