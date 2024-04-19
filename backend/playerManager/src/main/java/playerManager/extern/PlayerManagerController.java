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
import playerManager.intern.Rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
public class PlayerManagerController {

	@MessageMapping("/players/{stringLobbyId}")
	@SendTo("/subscribe/getPlayers/{stringLobbyId}")
	public String getPlayers(LobbyId message){
		if (Lobbies.getLobby(message.getLobbyId()) == null){
			return null;
		}

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
			//TODO In the feature look out for the distance
			victim.setColor(Colors.BLACK);
			victim.killed();
			return victim.toString();
		} else if (killer.getId().equals(victim.getId())) {
			return null;
		} else {
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
			//TODO In the feature look out for the distance
			Rest.startVoting(message.getLobbyId(), lobby.getPlayers(), message.getFromPlayerId());
			return "{\"response\": \"" + true + "\"}";
		} else {
			return null;
		}
	}
}

