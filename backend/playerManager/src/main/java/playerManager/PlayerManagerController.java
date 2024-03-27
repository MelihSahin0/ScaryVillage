package playerManager;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;
import playerManager.jsonDataTransferTypes.PlayerMessage;
import java.util.ArrayList;
import java.util.List;

@RestController
public class PlayerManagerController {

	List<Player> _players = new ArrayList<Player>();

	@MessageMapping("/playerMovement")
	@SendTo("/subscribe/playerPosition")
	public String handlePlayers(PlayerMessage message) throws Exception {
		//{"id": 123, "movement": ["w", "d"]}

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

		for (String str : stringArray) {
			switch (str) {
				case "w":
					_players.get(curPlayerId).move(0, 1);
					break;
				case "s":
					_players.get(curPlayerId).move(0, -1);
					break;
				case "a":
					_players.get(curPlayerId).move(-1, 0);
					break;
				case "d":
					_players.get(curPlayerId).move(1, 0);
					break;
			}
		}

		return _players.get(curPlayerId).toString();
	}

	@MessageMapping("/registerPlayer")
	@SendTo("/subscribe/lobby")
	public String addPlayer(){
		Player player = new Player("Player", 0, 0);
		_players.add(player);

		List<String> players = new ArrayList<String>();
		for (Player loopPlayer : _players){
			players.add(loopPlayer.toString());
		}

		return new JSONArray(players).toString();
	}
}
