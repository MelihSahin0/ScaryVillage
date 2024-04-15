package lobbyManager.extern;

import extern.enumarators.GameStatus;
import lobbyManager.Lobbies;
import lobbyManager.Lobby;
import extern.Player;
import extern.enumarators.Colors;
import extern.enumarators.Roles;
import lobbyManager.extern.jsonDataTransferTypes.*;
import lobbyManager.intern.Rest;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
public class LobbyController {

    //When Endpoints can be called internally too, use this. (Reference: removePlayer)
    private final SimpMessagingTemplate messagingTemplate = ApplicationContextHolder.getContext().getBean(SimpMessagingTemplate.class);

    @MessageMapping("/registerPlayer/{stringLobbyId}")
    @SendTo("/subscribe/lobby/{stringLobbyId}")
    public String addPlayer(AddPlayer message){

        if (message.getLobbyId().isEmpty()){
            return null;
        }
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());

        if (lobby.getPlayer(message.getPlayerId()) != null){
            return lobby.getPlayers().values().toString();
        }

        Player player = new Player();
        player.setId(message.getPlayerId());
        player.setName("Player " + message.getPlayerId().substring(0,4));
        player.setColor(getNextAvailableColor(lobby));
        player.setRole(lobby.getPlayers().isEmpty() || lobby.getPlayers().size() % 2 == 0 ? Roles.IMPOSTER : Roles.CREWMATE);
        player.setHost(lobby.getPlayers().isEmpty());
        lobby.stopTimer();
        lobby.addPlayer(message.getPlayerId(), player);
        lobby.startTimer();

        Rest.changeNumberOfPlayers(message.getLobbyId(), lobby.getPlayers().size());

        return lobby.getPlayers().values().toString();
    }

    private Colors getNextAvailableColor(Lobby lobby) {
        List<Colors> usedColors = new ArrayList<>();
        for (Player player : lobby.getPlayers().values()) {
            usedColors.add(player.getColor());
        }
        for (Colors color : Colors.values()) {
            if (!usedColors.contains(color)) {
                return color;
            }
        }
        return null;
    }

    @MessageMapping("/removePlayer/{stringLobbyId}")
    public void removePlayer(RemovePlayer message){
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());

        Player player = lobby.getPlayer(message.getPlayerId());
        lobby.stopTimer();
        lobby.removePlayer(message.getPlayerId());
        lobby.startTimer();

        if (lobby.getPlayers().isEmpty()){
            lobby.stopTimer();
            Lobbies.removeLobby(message.getLobbyId());
            Rest.removeLobby(message.getLobbyId());;
        } else if (player.isHost()){
            Object[] keys = lobby.getPlayers().keySet().toArray();

            Random random = new Random();
            Player host  = lobby.getPlayer((String) keys[random.nextInt(keys.length)]);
            host.setHost(true);
        }

        messagingTemplate.convertAndSend("/subscribe/lobby/" + message.getLobbyId(), lobby.getPlayers().values().toString());
    }

    @MessageMapping("/heartbeat/{stringLobbyId}")
    public void heartbeat(Heartbeat message){
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());
        lobby.resetTimer(message.getPlayerId());
    }

    @MessageMapping("/setLobbyStatus/{stringLobbyId}")
    @SendTo("/subscribe/getLobbyStatus/{stringLobbyId}")
    public String setLobbyStatus(LobbyStatus message){
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());
        lobby.setGameStatus(message.getGameStatus());
        Rest.changeGameState(message.getLobbyId(),message.getGameStatus());

        if (message.getGameStatus() == GameStatus.INGAME) {
            Rest.addLobby(message.getLobbyId(), lobby.getPlayers());
        }

        return message.toString();
    }

    @MessageMapping("/changeName/{stringLobbyId}")
    @SendTo("/subscribe/lobby/{stringLobbyId}")
    public String changeName(ChangeName message){

        if (message.getName().isEmpty()){
            return null;
        }

        Lobby lobby =  Lobbies.getLobby(message.getLobbyId());
        for (Player player : lobby.getPlayers().values()) {
            if (player.getName().equals(message.getName())){
                return null;
            }
        }

        Player player = lobby.getPlayer(message.getPlayerId());
        player.setName(message.getName());

        return lobby.getPlayers().values().toString();
    }

    @MessageMapping("/changeColor/{stringLobbyId}")
    @SendTo("/subscribe/lobby/{stringLobbyId}")
    public String changeColor(ChangeColor message){

        Lobby lobby =  Lobbies.getLobby(message.getLobbyId());
        for (Player player : lobby.getPlayers().values()) {
            if (player.getColor().equals(message.getColor())){
                return null;
            }
        }

        Player player = lobby.getPlayer(message.getPlayerId());
        player.setColor(message.getColor());

        return lobby.getPlayers().values().toString();
    }

    @MessageMapping("/getLobbySettings/{stringLobbyId}")
    @SendTo("/subscribe/lobbySettings/{stringLobbyId}")
    public String getLobbySettings(GetLobbySettings message){
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());
        return lobby.toString();
    }

    @MessageMapping("/changeVisibility/{stringLobbyId}")
    @SendTo("/subscribe/lobbySettings/{stringLobbyId}")
    public String changeVisibility(ChangeVisibility message){
        Lobby lobby =  Lobbies.getLobby(message.getLobbyId());
        lobby.setVisibility(message.getVisibility());

        Rest.changeVisibility(message.getLobbyId(), message.getVisibility());

        return lobby.toString();
    }

    @MessageMapping("/setMaxNumberOfPlayers/{stringLobbyId}")
    @SendTo("/subscribe/lobbySettings/{stringLobbyId}")
    public String setMaxNumberOfPlayers(ChangeMaxPlayer message){
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());
        lobby.setMaxNumberOfPlayers(message.getMaxNumberOfPlayers());

        Rest.changeMaxNumberOfPlayers(message.getLobbyId(), message.getMaxNumberOfPlayers());

        return lobby.toString();
    }
}
