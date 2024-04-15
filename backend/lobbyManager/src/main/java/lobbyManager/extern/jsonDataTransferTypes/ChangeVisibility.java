package lobbyManager.extern.jsonDataTransferTypes;

import extern.enumarators.Visibility;

public class ChangeVisibility {

    private String lobbyId;
    private Visibility visibility;

    public String getLobbyId() {
        return lobbyId;
    }

    public void setLobbyId(String lobbyId) {
        this.lobbyId = lobbyId;
    }

    public Visibility getVisibility() {
        return visibility;
    }

    public void setVisibility(Visibility visibility) {
        this.visibility = visibility;
    }

    @Override
    public String toString() {
        return "{" +
                "\"lobbyId\": \"" + lobbyId + "\"" +
                ", \"visibility: \"" + visibility.toString() + "\"" +
                '}';
    }
}
