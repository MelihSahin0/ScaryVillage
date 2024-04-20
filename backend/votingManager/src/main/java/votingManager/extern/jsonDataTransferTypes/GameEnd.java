package votingManager.extern.jsonDataTransferTypes;

import extern.enumarators.Roles;

public class GameEnd {
    private Roles winner;

    public Roles getWinner() {
        return winner;
    }

    public void setWinner(Roles winner) {
        this.winner = winner;
    }

    @Override
    public String toString() {
        return "{" +
                "\"winner\": \"" + winner + "\"" +
                '}';
    }
}
