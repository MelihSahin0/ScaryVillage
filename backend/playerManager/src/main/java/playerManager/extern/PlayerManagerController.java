package playerManager.extern;

import extern.enumarators.Colors;
import intern.LobbyId;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import playerManager.Player;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;
import extern.enumarators.Roles;
import playerManager.Lobbies;
import playerManager.Lobby;
import playerManager.extern.jsonDataTransferTypes.*;
import playerManager.intern.Rest;

import java.util.*;

@RestController
public class PlayerManagerController {

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

	@MessageMapping("/playerMovement/{stringLobbyId}")
	@SendTo("/subscribe/playerPosition/{stringLobbyId}")
	public String handlePlayers(PlayerMoved message) {
		if (Lobbies.getLobby(message.getLobbyId()) == null){
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

	public void killCooldown(KillCooldown message){
		messagingTemplate.convertAndSend("/subscribe/killCooldown/" + message.getLobbyId(), message.toString());
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

		if ( killer.getRole() == Roles.IMPOSTER && victim.getRole() == Roles.CREWMATE && killer.getAllowedToKillIn() == 0) {
			//TODO In the feature look out for the distance
			victim.setColor(Colors.BLACK);
			victim.killed();
			killer.startKillCooldown(message.getLobbyId());
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

		if (message.getToPlayerId().equals("emergency")){
			if ( reporter.getRole() == Roles.IMPOSTER || reporter.getRole() == Roles.CREWMATE) {
				//TODO In the feature look out for the distance
				Rest.startVoting(message.getLobbyId(), lobby.getPlayers(), message.getFromPlayerId());
				return "{\"response\": \"" + true + "\"}";
			} else {
				return null;
			}
		} else {
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
}

