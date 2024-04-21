package extern.enumarators;

public enum GameStatus {
    INGAME("inGame"),
    LOBBY("lobby");

    private static final GameStatus[] gameStatuses = GameStatus.values();
    private final String gameStatus;

    GameStatus(String gameStatus) {
        this.gameStatus = gameStatus;
    }

    public static GameStatus getGameStatus(int i){
        return gameStatuses[i];
    }

    public static GameStatus getGameStatus(String gameStatus){
       for(GameStatus gs : gameStatuses){
           if (gs.gameStatus.equals(gameStatus)){
               return gs;
           }
       }
       return null;
    }

    @Override
    public String toString() {
        return gameStatus;
    }
}