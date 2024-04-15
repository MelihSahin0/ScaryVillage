package playerManager.extern;

import extern.enumarators.Colors;
import intern.LobbyId;
import org.json.JSONObject;
import playerManager.Player;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;
import extern.enumarators.Roles;
import playerManager.Lobbies;
import playerManager.Lobby;
import playerManager.extern.jsonDataTransferTypes.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
public class PlayerManagerController {

	@MessageMapping("/players/{stringLobbyId}")
	@SendTo("/subscribe/getPlayers/{stringLobbyId}")
	public String getPlayers(LobbyId message){
		return Lobbies.getLobby(message.getLobbyId()).getPlayers().values().toString();
	}

	@MessageMapping("/playerMovement/{stringLobbyId}")
	@SendTo("/subscribe/playerPosition/{stringLobbyId}")
	public String handlePlayers(PlayerMoved message) {

		if (message.getLobbyId().isEmpty()){
			return null;
		}

		Lobby lobby = Lobbies.getLobby(message.getLobbyId());
		Player player = lobby.getPlayer(message.getPlayerId());
		if (player != null){
			player.initiateMove(message.getMovement());
			return player.toString();
		}

		return null;
	}

	@MessageMapping("/killPlayer/{stringLobbyId}" )
	@SendTo("/subscribe/kill/{stringLobbyId}")
	public String kill(PlayerClicked message){

		if (message.getLobbyId().isEmpty()){
			return null;
		}

		Lobby lobby =  Lobbies.getLobby(message.getLobbyId());
		Player killer = lobby.getPlayer(message.getFromPlayerId());
		Player victim = lobby.getPlayer(message.getToPlayerId());

		if (killer == null || victim == null){
			return null;
		}

		if ( killer.getRole() == Roles.IMPOSTER && victim.getRole() == Roles.CREWMATE) {
			//In the feature look out for the distance
			victim.setColor(Colors.BLACK);
			victim.killed();
			return victim.toString();
		} else if (killer.getId().equals(victim.getId())) {
			System.out.println("Not allowed");
			return null;
		} else {
			System.out.println("Not allowed");
			return null;
		}
	}

	@MessageMapping("/report/{stringLobbyId}" )
	@SendTo("/subscribe/report/{stringLobbyId}")
	public String reportCorpse(PlayerClicked message){

		if (message.getLobbyId().isEmpty()){
			return null;
		}

		Lobby lobby =  Lobbies.getLobby(message.getLobbyId());
		Player reporter = lobby.getPlayers().get(message.getFromPlayerId());
		Player victim = lobby.getPlayers().get(message.getToPlayerId());;

		if (reporter == null || victim == null){
			return null;
		}

		if ( reporter.getRole() == Roles.IMPOSTER || reporter.getRole() == Roles.CREWMATE) {
			//In the feature look out for the distance

			System.out.println("REPORTED:" + reporter.getId() + " " + victim.getId());

			return "{\"report\": true, \"reporter\": \"" + reporter.getId() + "\", \"victim\": \"" + victim.getId() + "\"}";

		} else {
			System.out.println("Not allowed");
			return null;
		}
	}

	@MessageMapping("/voting/{stringLobbyId}" )
	@SendTo("/subscribe/voting/{stringLobbyId}")
	public String voting(Voting message){

		if (message.getLobbyId().isEmpty()){
			return null;
		}

		System.out.println(message.isEndVoting());

        Lobby lobby = Lobbies.getLobby(message.getLobbyId());
        if (!message.isEndVoting()){
            lobby.getPlayer(message.getFromPlayerId()).setVotedFor(message.getToPlayerId());
		} else {
            HashMap<String, Integer> votedPlayer = countVotedPlayers(lobby);
			String mFP = findMostFrequentPlayerId(votedPlayer);

			if ("".equals(mFP)) {
				System.out.println("DRAW!");
				return null;
			}

			if (lobby.getPlayer(mFP).getRole() == Roles.CREWMATE) {
				lobby.getPlayer(mFP).setRole(Roles.CREWMATEGHOST);
			} else if (lobby.getPlayer(mFP).getRole() == Roles.IMPOSTER) {
				lobby.getPlayer(mFP).setRole(Roles.IMPOSTERGHOST);
			}
			lobby.getPlayer(mFP).setColor(Colors.BLACK);

			System.out.println("Player ID with the most occurrences: " + mFP);

			return lobby.getPlayer(mFP).toString();
		}
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
				player.setVotedFor("");
			}
		}

		return votedPlayer;
	}

	private static String findMostFrequentPlayerId(HashMap<String, Integer> votedPlayer) {
		String mostFrequentPlayerId = null;
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

