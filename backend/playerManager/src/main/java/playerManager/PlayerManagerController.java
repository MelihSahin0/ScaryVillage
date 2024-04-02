package playerManager;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;
import playerManager.enumarators.Roles;
import playerManager.jsonDataTransferTypes.PlayerClicked;
import playerManager.jsonDataTransferTypes.PlayerMessage;
import java.util.ArrayList;
import java.util.List;

@RestController
public class PlayerManagerController {

	List<Player> _players = new ArrayList<Player>();

	@MessageMapping("/playerMovement")
	@SendTo("/subscribe/playerPosition")
	public String handlePlayers(PlayerMessage message) throws Exception {

		JSONObject jo = new JSONObject(
				message
		);

		JSONArray jsonArray = jo.getJSONArray("movement");
		String[] stringArray = new String[jsonArray.length()];

		// Fill the String array with characters from jsonArray
		for (int i = 0; i < jsonArray.length(); i++) {
			stringArray[i] = jsonArray.getString(i);
		}

		int curPlayerId = message.getId();
		_players.get(curPlayerId).initiateMove(stringArray);

		return _players.get(curPlayerId).toString();
	}

	@MessageMapping("/registerPlayer")
	@SendTo("/subscribe/lobby")
	public String addPlayer(){
		//Roles to do
		Player player = new Player("Player", 0, 0, _players.size() % 2 == 0 ? Roles.IMPOSTER : Roles.CREWMATE);
		_players.add(player);

		return _players.toString();
	}

	@MessageMapping("/killPlayer")
	@SendTo("/subscribe/kill")
	public String kill(PlayerClicked playerClicked){

		Player killer = _players.get(playerClicked.getFromId());
		Player victim = _players.get(playerClicked.getToId());

		if ( killer.getRole() == Roles.IMPOSTER && victim.getRole() == Roles.CREWMATE) {
			//In the feature look out for the distance
			victim.killed();
			return victim.toString();
		} else if (killer.getId() == killer.getId()) {
			System.out.println("Not allowed");
			return null;
		} else {
			System.out.println("Not allowed");
			return null;
		}
	}
}
