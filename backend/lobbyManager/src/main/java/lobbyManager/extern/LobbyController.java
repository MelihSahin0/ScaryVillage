package lobbyManager.extern;

import extern.enumarators.GameStatus;
import lobbyManager.Lobbies;
import lobbyManager.Lobby;
import lobbyManager.Message;
import lobbyManager.Player;
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

    //When Endpoints can be called internally too, use this.
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
        player.setRole(Roles.CREWMATE);
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

        if (lobby == null){
            return;
        }

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
            String playerId = (String) keys[random.nextInt(keys.length)];
            Player host  = lobby.getPlayer(playerId);
            host.setHost(true);
        }

        messagingTemplate.convertAndSend("/subscribe/lobby/" + message.getLobbyId(), lobby.getPlayers().values().toString());
    }

    @MessageMapping("/heartbeat/{stringLobbyId}")
    public void heartbeat(Heartbeat message){
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());
        try {
            lobby.resetTimer(message.getPlayerId());
        } catch (Exception ignore){}
    }

    @MessageMapping("/setLobbyStatus/{stringLobbyId}")
    @SendTo("/subscribe/getLobbyStatus/{stringLobbyId}")
    public String setLobbyStatus(LobbyStatus message){
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());
        lobby.setGameStatus(message.getGameStatus());
        Rest.changeGameState(message.getLobbyId(),message.getGameStatus());

        if (message.getGameStatus() == GameStatus.INGAME) {
            lobby.setImposters();
            Rest.addLobby(message.getLobbyId(), lobby.getPlayers(), lobby.getBellCooldownTime(),
                    lobby.getKillCooldownTime(), lobby.getVotingTime(), lobby.getKillOne(), lobby.getChangeVotingNumberVisibility());
            lobby.setEveryoneCrewmate();
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

    @MessageMapping("/setNumberOfImpostor/{stringLobbyId}")
    @SendTo("/subscribe/lobbySettings/{stringLobbyId}")
    public String setNumberOfImpostor(ChangeNumberOfImpostor message){
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());
        lobby.setMaxImposter(message.getNumberOfImpostor());
        return lobby.toString();
    }
    @MessageMapping("/setKillCooldown/{stringLobbyId}")
    @SendTo("/subscribe/lobbySettings/{stringLobbyId}")
    public String setKillCooldownTime(ChangeKillCooldown message){
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());
        lobby.setKillCooldownTime(message.getKillCooldownTime());
        return lobby.toString();
    }
    @MessageMapping("/setBellCooldown/{stringLobbyId}")
    @SendTo("/subscribe/lobbySettings/{stringLobbyId}")
    public String setBellCooldownTime(ChangeBellCooldown message){
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());
        lobby.setBellCooldownTime(message.getBellCooldownTime());
        return lobby.toString();
    }
    @MessageMapping("/setVotingTime/{stringLobbyId}")
    @SendTo("/subscribe/lobbySettings/{stringLobbyId}")
    public String setVotingTime(ChangeVotingTime message){
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());
        lobby.setVotingTime(message.getVotingTime());
        return lobby.toString();
    }

    @MessageMapping("/setKillOne/{stringLobbyId}")
    @SendTo("/subscribe/lobbySettings/{stringLobbyId}")
    public String setKillOne(KillOne message){
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());
        lobby.setKillOne(message.getKillOne());
        return lobby.toString();
    }

    @MessageMapping("/changeVotingNumberVisibility/{stringLobbyId}")
    @SendTo("/subscribe/lobbySettings/{stringLobbyId}")
    public String changeVotingNumberVisibility(ChangeVotingNumberVisibility message){
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());
        lobby.setChangeVotingNumberVisibility(message.getChangeVotingNumberVisibility());
        return lobby.toString();
    }

    @MessageMapping("/getMessages/{stringLobbyId}")
    public void getAllMessages(GetMessages message){
        messagingTemplate.convertAndSend("/subscribe/getMessages/" + message.getLobbyId(), Lobbies.getLobby(message.getLobbyId()).getMessages().toString());
    }

    @MessageMapping("/addMessage/{stringLobbyId}")
    public void addMessage(AddMessage message){
        Lobby lobby = Lobbies.getLobby(message.getLobbyId());
        if (message.getMessage().isEmpty()){
            return;
        }
        lobby.addMessage(new Message("true".equals(message.getIsAlive()), lobby.getPlayer(message.getPlayerId()).getName(), message.getMessage()));

        GetMessages getMessages = new GetMessages();
        getMessages.setLobbyId(lobby.getLobbyId());
        getAllMessages(getMessages);
    }
}
