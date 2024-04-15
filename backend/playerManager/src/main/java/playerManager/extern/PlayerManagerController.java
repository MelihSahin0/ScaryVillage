package playerManager.extern;

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

	ArrayList<ArrayList<String>> playersVoting = new ArrayList<>();

	@MessageMapping("/voting/{stringLobbyId}" )
	@SendTo("/subscribe/voting/{stringLobbyId}")
	public String voting(PlayerClicked message){

		if (message.getLobbyId().isEmpty()){
			return null;
		}

		ArrayList<String> row1 = new ArrayList<>();
		row1.add(message.getFromPlayerId());
		row1.add(message.getToPlayerId());
		playersVoting.add(row1);

		System.out.println("VOTED FROM: " + message.getFromPlayerId() + " TO: " + message.getToPlayerId() );

		System.out.println("LIST SIZE:" + playersVoting.size());
		System.out.println("LOBBIES SIZE:" + Lobbies.getLobby(message.getLobbyId()).getPlayers().size());

		if(playersVoting.size() == Lobbies.getLobby(message.getLobbyId()).getPlayers().size()) {
			System.out.println("HANDLE KILLING!!");

			HashMap<String, Integer> counts = getCountsAtPosition(playersVoting, 1);

			// Find the player ID with the most occurrences
			String mostFrequentPlayerId = findMostFrequentPlayerId(counts);

			if (Objects.equals(mostFrequentPlayerId, "")) {
				playersVoting = new ArrayList<>();
				return "{}";
			}

			System.out.println("COUNTS: " + counts);

			String mFP = findMostFrequentPlayerId(counts);
			System.out.println(mFP);

			if(mFP != null) {
				//change role when "winner" is announced
				if (Lobbies.getLobby(message.getLobbyId()).getPlayers().get(mFP).getRole() == Roles.CREWMATE) {
					Lobbies.getLobby(message.getLobbyId()).getPlayers().get(mFP).setRole(Roles.CREWMATEGHOST);
				} else if (Lobbies.getLobby(message.getLobbyId()).getPlayers().get(mFP).getRole() == Roles.IMPOSTER) {
					Lobbies.getLobby(message.getLobbyId()).getPlayers().get(mFP).setRole(Roles.IMPOSTERGHOST);
				}
			} else {
				System.out.println("DRAW!");
			}

			// Print the most frequent player ID
			System.out.println("Player ID with the most occurrences: " + mostFrequentPlayerId);

			JSONObject json = new JSONObject(counts);
			json.put("winner", mFP);
			json.put("winnerRole", Lobbies.getLobby(message.getLobbyId()).getPlayers().get(mFP).getRole());

			//reset
			playersVoting = new ArrayList<>();

			return json.toString();
		}


		Lobby lobby =  Lobbies.getLobby(message.getLobbyId());

		return null;
	}

	public static HashMap<String, Integer> getCountsAtPosition(ArrayList<ArrayList<String>> matrix, int position) {
		HashMap<String, Integer> counts = new HashMap<>();

		for (ArrayList<String> row : matrix) {
			if (row.size() > position) {
				String playerId = row.get(position);
				counts.put(playerId, counts.getOrDefault(playerId, 0) + 1);
			}
		}

		return counts;
	}

	public static String findMostFrequentPlayerId(HashMap<String, Integer> counts) {
		String mostFrequentPlayerId = null;
		int maxCount = 0;

		for (Map.Entry<String, Integer> entry : counts.entrySet()) {
			if (entry.getValue() >= maxCount) {
				if (entry.getValue() == maxCount) {
					return null;
				}
				maxCount = entry.getValue();
				mostFrequentPlayerId = entry.getKey();
			}
		}

		return mostFrequentPlayerId;
	}

}

