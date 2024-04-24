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

	public void bellCooldown(BellCooldown message){
		messagingTemplate.convertAndSend("/subscribe/bellCooldown/" + message.getLobbyId(), message.toString());
	}

	public void killCooldown(KillCooldown message){
		messagingTemplate.convertAndSend("/subscribe/killCooldown/" + message.getLobbyId(), message.toString());
	}

	@MessageMapping("/killPlayer/{stringLobbyId}" )
	@SendTo("/subscribe/kill/{stringLobbyId}")
	public String kill(PlayerClicked message){
		if (Lobbies.getLobby(message.getLobbyId()) == null){
			return null;
		}

		Lobby lobby =  Lobbies.getLobby(message.getLobbyId());
		Player killer = lobby.getPlayer(message.getFromPlayerId());
		Player victim = lobby.getPlayer(message.getToPlayerId());

		if (killer == null || victim == null){
			return null;
		}

		if ( killer.getRole() == Roles.IMPOSTER && victim.getRole() == Roles.CREWMATE && killer.getAllowedToKillIn() == 0) {

			double distance = Math.sqrt(Math.pow(victim.getX() - killer.getX(),2) + Math.pow(victim.getY() - killer.getY(),2));
			if (distance > 0.4){
				return null;
			}

			victim.setColor(Colors.BLACK);
			victim.killed();

			if (imposterWon(lobby)){
				GameFinished gameFinished = new GameFinished();
				gameFinished.setGameFinished(true);
				messagingTemplate.convertAndSend("/subscribe/kill/" + message.getLobbyId(), gameFinished.toString());

				Rest rest = new Rest();
				LobbyId internMessage = new LobbyId();
				internMessage.setLobbyId(message.getLobbyId());
				rest.gameFinished(internMessage);

				return null;
			} else {
				killer.startKillCooldown(message.getLobbyId());
				return victim.toString();
			}
		} else if (killer.getId().equals(victim.getId())) {
			return null;
		} else {
			return null;
		}
	}

	private boolean imposterWon(Lobby lobby){
		int imposter = (int) lobby.getPlayers().values().stream().filter(player -> player.getRole().equals(Roles.IMPOSTER)).count();
		int crewmate = (int) lobby.getPlayers().values().stream().filter(player -> player.getRole().equals(Roles.CREWMATE)).count();

        return imposter >= crewmate;
    }

	@MessageMapping("/report/{stringLobbyId}" )
	@SendTo("/subscribe/report/{stringLobbyId}")
	public String reportCorpse(PlayerClicked message){

		if (message.getLobbyId().isEmpty()){
			return null;
		}

		Lobby lobby =  Lobbies.getLobby(message.getLobbyId());

		if (lobby.getAllowedToBellIn() != 0){
			return null;
		}

		Player reporter = lobby.getPlayers().get(message.getFromPlayerId());

		if (message.getToPlayerId().equals("emergency")){
			if ( reporter.getRole() == Roles.IMPOSTER || reporter.getRole() == Roles.CREWMATE) {
				double distance = Math.sqrt(Math.pow(0.1 - reporter.getX(),2) + Math.pow(0.2 - reporter.getY(),2));
				if (distance <= 0.6){
					Rest.startVoting(message.getLobbyId(), lobby.getPlayers(), message.getFromPlayerId(), lobby.getVotingTime());
					return "{\"response\": \"" + true + "\"}";
				}
            }
            return null;
        } else {
			Player victim = lobby.getPlayers().get(message.getToPlayerId());;

			if (reporter == null || victim == null){
				return null;
			}
			if ( reporter.getRole() == Roles.IMPOSTER || reporter.getRole() == Roles.CREWMATE) {
				double distance = Math.sqrt(Math.pow(victim.getX() - reporter.getX(),2) + Math.pow(victim.getY() - reporter.getY(),2));
				if (distance <= 0.4){
					Rest.startVoting(message.getLobbyId(), lobby.getPlayers(), message.getFromPlayerId(), lobby.getVotingTime());
					return "{\"response\": \"" + true + "\"}";
				}
            }
            return null;
        }
	}
}

