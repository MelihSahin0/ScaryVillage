package playerManager;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;


@RestController
public class PlayerManagerController {

	ArrayList<Player> _players = new ArrayList<Player>();

	@MessageMapping("/playermanager")
	@SendTo("/topic/map")
	public PlayerData handlePlayers(PlayerMessage message) throws Exception {
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

		return new PlayerData("{\"id\": " + curPlayerId + ", \"position\": {\"x\": " + _players.get(curPlayerId).getX() + ", \"y\": " + _players.get(curPlayerId).getY() + "}}");
	}

	@GetMapping(value = "/requestId")
	public int sendPlayerId() {
		Player player = new Player("Player", 0, 0);
		_players.add(player);
		return player.getId();
	}
}
