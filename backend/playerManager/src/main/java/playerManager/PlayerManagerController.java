package playerManager;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;
import playerManager.enumarators.Colors;
import playerManager.enumarators.GameStatus;
import playerManager.enumarators.Roles;
import playerManager.jsonDataTransferTypes.*;

import java.sql.SQLOutput;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
public class PlayerManagerController {

	private GameStatus gameStatus;


	public GameStatus getGameStatus() {
		return gameStatus;
	}

	public void setGameStatus(GameStatus gameStatus) {
		this.gameStatus = gameStatus;
	}

	public static PlayerManagerController addLobby(@DestinationVariable String stringLobbyId){
		PlayerManagerController p = new PlayerManagerController();
		p.setGameStatus(GameStatus.LOBBY);
		return p;
	}

	private final HashMap<String, Lobby> lobbies = new HashMap<>();
	//Lobby
	@MessageMapping("/registerPlayer/{stringLobbyId}")
	@SendTo("/subscribe/lobby/{stringLobbyId}")
	public String addPlayer(AddPlayer message){

		if (message.getLobbyId().isEmpty()){
			return null;
		}
		Lobby lobby = lobbies.get(message.getLobbyId());

		if (lobby == null){
			lobby = new Lobby();
			lobbies.put(message.getLobbyId(), lobby);
		}

		if (lobby.getPlayers().size() >= 10){
			return null;
		}

		Player player = new Player(message.getPlayerId(), "Player " + lobby.getPlayers().size(), Colors.getColor(lobby.getPlayers().size()), 0, 0, lobby.getPlayers().isEmpty() || lobby.getPlayers().size() % 2 == 0 ? Roles.IMPOSTER : Roles.CREWMATE);
		lobby.addPlayers(player);

		return lobby.getPlayers().values().toString();
	}

	@MessageMapping("/changeName/{stringLobbyId}")
	@SendTo("/subscribe/lobby/{stringLobbyId}")
	public String changeName(ChangeName message){

		if (message.getName().isEmpty()){
			return null;
		}

		Lobby lobby =  lobbies.get(message.getLobbyId());
		for (Player player : lobby.getPlayers().values()) {
			if (player.getName().equals(message.getName())){
				return null;
			}
		}

		Player player = lobby.getPlayers().get(message.getPlayerId());
		player.setName(message.getName());

		return lobby.getPlayers().values().toString();
	}

	@MessageMapping("/changeColor/{stringLobbyId}")
	@SendTo("/subscribe/lobby/{stringLobbyId}")
	public String changeColor(ChangeColor message){

		Lobby lobby =  lobbies.get(message.getLobbyId());
		for (Player player : lobby.getPlayers().values()) {
			if (player.getColor().equals(message.getColor())){
				return null;
			}
		}

		Player player = lobby.getPlayers().get(message.getPlayerId());
		player.setColor(message.getColor());

		return lobby.getPlayers().values().toString();
	}

	//InGame
	@MessageMapping("/playerMovement/{stringLobbyId}")
	@SendTo("/subscribe/playerPosition/{stringLobbyId}")
	public String handlePlayers(PlayerMoved message) {

		System.out.println(message.toString());

		if (message.getLobbyId().isEmpty()){
			return null;
		}

		JSONObject jo = new JSONObject(message);
		JSONArray jsonArray = jo.getJSONArray("movement");
		String[] stringArray = new String[jsonArray.length()];

		// Fill the String array with characters from jsonArray
		for (int i = 0; i < jsonArray.length(); i++) {
			stringArray[i] = jsonArray.getString(i);
		}

		Lobby lobby = lobbies.get(message.getLobbyId());
		Player player = lobby.getPlayers().get(message.getPlayerId());
		if (player != null){
			player.initiateMove(stringArray);
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

		Lobby lobby =  lobbies.get(message.getLobbyId());
		Player killer = lobby.getPlayers().get(message.getFromPlayerId());
		Player victim = lobby.getPlayers().get(message.getToPlayerId());;

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

		Lobby lobby =  lobbies.get(message.getLobbyId());
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
		System.out.println("LOBBIES SIZE:" + lobbies.get(message.getLobbyId()).getPlayers().size());

		if(playersVoting.size() == lobbies.get(message.getLobbyId()).getPlayers().size()) {
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
				if (lobbies.get(message.getLobbyId()).getPlayers().get(mFP).getRole() == Roles.CREWMATE) {
					lobbies.get(message.getLobbyId()).getPlayers().get(mFP).setRole(Roles.CREWMATEGHOST);
				} else if (lobbies.get(message.getLobbyId()).getPlayers().get(mFP).getRole() == Roles.IMPOSTER) {
					lobbies.get(message.getLobbyId()).getPlayers().get(mFP).setRole(Roles.IMPOSTERGHOST);
				}
			} else {
				System.out.println("DRAW!");
			}

			// Print the most frequent player ID
			System.out.println("Player ID with the most occurrences: " + mostFrequentPlayerId);

            JSONObject json = new JSONObject(counts);
            json.put("winner", mFP);

            //reset
			playersVoting = new ArrayList<>();

			return json.toString();
		}


		Lobby lobby =  lobbies.get(message.getLobbyId());

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
