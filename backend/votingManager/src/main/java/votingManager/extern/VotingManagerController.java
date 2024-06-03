package votingManager.extern;

import extern.enumarators.Colors;
import extern.enumarators.Roles;
import intern.LobbyId;
import org.springframework.beans.factory.annotation.Autowired;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
public class VotingManagerController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public VotingManagerController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

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
        boolean killOne = lobby.getKillOne();
        ArrayList<Player> votedPlayer = countVotedPlayers(lobby);
        ArrayList<String> mFP = findMostFrequentPlayerId(votedPlayer);

        if (mFP.size() == 1 || (mFP.size() > 1 && killOne)) {
                Random random = new Random();

                int burn = mFP.size() == 1 ? 0 : random.nextInt(mFP.size());
                Player player = lobby.getPlayer(mFP.get(burn));
                player.setKilled(true);
                player.killed();
                player.setColor(Colors.BLACK);
         }

        Rest.sendResult(lobbyId);

        int imposter = 0;
        int crewmate = 0;

        for (Player player : lobby.getPlayers().values()){
            switch(player.getRole()) {
                case IMPOSTER -> imposter += 1;
                case CREWMATE -> crewmate += 1;
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
        HashMap<String, Player> players = Lobbies.getLobby(lobbyId).getPlayers();

        if (Lobbies.getLobby(lobbyId).getChangeVotingNumberVisibility()){
            for (Player player : players.values()) {
                player.setNumberOfVotes(0);
            }
        }

        messagingTemplate.convertAndSend("/subscribe/getPlayers/" + lobbyId, players.values().toString());
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

    private static ArrayList<Player> countVotedPlayers(Lobby lobby){
        ArrayList<Player> votedPlayer = new ArrayList<Player>();
        for (Player p : lobby.getPlayers().values()) {
            Player player = p;
            if (player.getRole().equals(Roles.IMPOSTER) || player.getRole().equals(Roles.CREWMATE)) {
                if (player.getVotedFor() != null && !player.getVotedFor().isEmpty()) {
                    lobby.getPlayer(player.getVotedFor()).incrementNumberOfVotes();
                }
            }
            votedPlayer.add(p);
        }
        return votedPlayer;
    }

    private static ArrayList<String> findMostFrequentPlayerId(ArrayList<Player> votedPlayer) {
        ArrayList<String> mostFrequentPlayerId = new ArrayList<String>();
        int maxCount = 0;
        for (Player player : votedPlayer) {
            int count = player.getNumberOfVotes() != 0 ? player.getNumberOfVotes() : 0;
            if (count > maxCount) {
                maxCount = count;
                mostFrequentPlayerId = new ArrayList<String>();
                mostFrequentPlayerId.add(player.getId());
            } else if (count == maxCount) {
                mostFrequentPlayerId.add(player.getId());
            }
        }
        return mostFrequentPlayerId;
    }
}
