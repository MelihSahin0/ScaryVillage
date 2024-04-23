package votingManager.extern;

import extern.enumarators.Colors;
import extern.enumarators.Roles;
import intern.LobbyId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;
import votingManager.Lobbies;
import votingManager.Lobby;
import votingManager.Player;
import votingManager.extern.jsonDataTransferTypes.GameEnd;
import votingManager.extern.jsonDataTransferTypes.Voting;
import votingManager.extern.jsonDataTransferTypes.VotingTime;
import votingManager.intern.Rest;
import java.util.HashMap;
import java.util.Map;

@RestController
public class VotingManagerController {

    private static final Logger log = LoggerFactory.getLogger(VotingManagerController.class);
    //When Endpoints can be called internally too, use this. (Reference: removePlayer)
    private final SimpMessagingTemplate messagingTemplate = ApplicationContextHolder.getContext().getBean(SimpMessagingTemplate.class);

    @MessageMapping("/players/{stringLobbyId}")
    @SendTo("/subscribe/getPlayers/{stringLobbyId}")
    public String getPlayers(LobbyId message){
        if (Lobbies.getLobby(message.getLobbyId()) == null){
            return null;
        }

        return Lobbies.getLobby(message.getLobbyId()).getPlayers().values().toString();
    }

    public void sendTime(VotingTime message){
        messagingTemplate.convertAndSend("/subscribe/getVotingTime/" + message.getLobbyId(), message.toString());
    }

    public void sendResult(String lobbyId){
        Lobby lobby = Lobbies.getLobby(lobbyId);
        HashMap<String, Integer> votedPlayer = countVotedPlayers(lobby);
        String mFP = findMostFrequentPlayerId(votedPlayer);

        if (mFP != null && !mFP.isEmpty()) {
            Player player = lobby.getPlayer(mFP);
            player.setKilled(true);
            player.killed();
            player.setColor(Colors.BLACK);
        }

        Rest.sendResult(lobbyId);

        int imposter = 0;
        int crewmate = 0;

        for (Player player : lobby.getPlayers().values()){
            switch(player.getRole()) {
                case Roles.IMPOSTER -> imposter += 1;
                case Roles.CREWMATE -> crewmate += 1;
            }
        }

        GameEnd gameEnd = new GameEnd();
        boolean gameOver = false;
        if (imposter >= crewmate){
            gameEnd.setWinner(Roles.IMPOSTER);
            gameOver = true;
        } else if (imposter == 0){
            gameEnd.setWinner(Roles.CREWMATE);
            gameOver = true;
        }

        messagingTemplate.convertAndSend("/subscribe/getPlayers/" + lobbyId, lobby.getPlayers().values().toString());
        if (gameOver){
            messagingTemplate.convertAndSend("/subscribe/gameEnd/" + lobbyId, gameEnd.toString());
            Rest.gameFinished(lobbyId);
            Lobbies.removeLobby(lobbyId);
        }
     }

    @MessageMapping("/voting/{stringLobbyId}" )
    public String voting(Voting message){

        if (message.getLobbyId().isEmpty()){
            return null;
        }

        Lobby lobby = Lobbies.getLobby(message.getLobbyId());
        lobby.getPlayer(message.getFromPlayerId()).setVotedFor(message.getToPlayerId());
        return null;
    }

    private static HashMap<String, Integer> countVotedPlayers(Lobby lobby){
        HashMap<String, Integer> votedPlayer = new HashMap<>();
        for (Map.Entry<String, Player> entry : lobby.getPlayers().entrySet()) {
            Player player = entry.getValue();
            if (player.getRole() == Roles.IMPOSTER || player.getRole() == Roles.CREWMATE) {
                if (votedPlayer.containsKey(player.getVotedFor())) {
                    votedPlayer.put(player.getVotedFor(), votedPlayer.get(player.getVotedFor()) + 1);
                } else {
                    votedPlayer.put(player.getVotedFor(), 0);
                }
                if (player.getVotedFor() != null && !player.getVotedFor().isEmpty()) {
                    lobby.getPlayer(player.getVotedFor()).incrementNumberOfVotes();
                }
            }
        }
        return votedPlayer;
    }

    private static String findMostFrequentPlayerId(HashMap<String, Integer> votedPlayer) {
        String mostFrequentPlayerId = "";
        int maxCount = 0;
        int numberOfPeopleWithMaxCount = 0;
        for (Map.Entry<String, Integer> entry : votedPlayer.entrySet()) {
            int count = entry.getValue();
            if (count > maxCount) {
                maxCount = count;
                mostFrequentPlayerId = entry.getKey();
                numberOfPeopleWithMaxCount = 1;
            } else if (count == maxCount) {
                numberOfPeopleWithMaxCount++;
            }
        }
        return (numberOfPeopleWithMaxCount == 1) ? mostFrequentPlayerId : "";
    }
}