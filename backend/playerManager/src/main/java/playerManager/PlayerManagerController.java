package playerManager;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;
import playerManager.enumarators.GameStatus;
import playerManager.enumarators.Roles;
import playerManager.jsonDataTransferTypes.AddPlayer;
import playerManager.jsonDataTransferTypes.PlayerClicked;
import playerManager.jsonDataTransferTypes.PlayerMoved;
import java.util.HashMap;

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

	@MessageMapping("/playerMovement/{stringLobbyId}")
	@SendTo("/subscribe/playerPosition/{stringLobbyId}")
	public String handlePlayers(PlayerMoved message) {

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
		for (Player player : lobby.getPlayers()){
			if (player.getId().equals(message.getPlayerId())){
				player.initiateMove(stringArray);
				return player.toString();
			}
		}

		return null;
	}

	@MessageMapping("/registerPlayer/{stringLobbyId}")
	@SendTo("/subscribe/lobby/{stringLobbyId}")
	public String addPlayer(AddPlayer message){

		if (message.getLobbyId().isEmpty()){
			return null;
		}

		Player player = null;
		Lobby lobby = lobbies.get(message.getLobbyId());

		if (lobby == null){
			lobby = new Lobby();
			lobbies.put(message.getLobbyId(), lobby);
		}

		player = new Player(message.getPlayerId(), "Player", 0, 0, lobby.getPlayers().isEmpty() || lobby.getPlayers().size() % 2 == 0 ? Roles.IMPOSTER : Roles.CREWMATE);
		lobby.addPlayers(player);

		return lobby.getPlayers().toString();
	}

	@MessageMapping("/killPlayer/{stringLobbyId}" )
	@SendTo("/subscribe/kill/{stringLobbyId}")
	public String kill(PlayerClicked message){

		if (message.getLobbyId().isEmpty()){
			return null;
		}

		Player killer = null;
		Player victim = null;

		Lobby lobby =  lobbies.get(message.getLobbyId());
		for (Player player : lobby.getPlayers()){
			if (message.getFromPlayerId().equals(player.getId())){
				killer = player;
			}
			if (message.getToPlayerId().equals(player.getId())){
				victim = player;
			}
		}

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
}
