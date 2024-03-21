package com.example.messagingstompwebsocket;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class PlayerManagerController {

	Player _p1 = new Player("Player1", 50, 50);

	@MessageMapping("/playermanager")
	@SendTo("/topic/map")
	public PlayerData handlePlayers(PlayerMessage message) throws Exception {
		//{"id": "123", "movement": ["w", "d"]}

		JSONObject jo = new JSONObject(
				message.getName()
		);

		JSONArray jsonArray = jo.getJSONArray("movement");
		String[] stringArray = new String[jsonArray.length()];

		// Fill the String array with characters from jsonArray
		for (int i = 0; i < jsonArray.length(); i++) {
			stringArray[i] = jsonArray.getString(i);
		}



		for (String str : stringArray) {
			switch (str) {
				case "w":
					_p1.move(0, -1);
					break;
				case "s":
					_p1.move(0, 1);
					break;
				case "a":
					_p1.move(-1, 0);
					break;
				case "d":
					_p1.move(1, 0);
					break;
			}
		}

		//System.out.println(jo.get("movement"));
		//System.out.println(stringArray[0]);

		System.out.println(_p1.getX() + " " + _p1.getY());


		return new PlayerData("{'id': '" + _p1.getId() + "', 'position':['x': '" + _p1.getX() + "', 'y': '" + _p1.getY() +"']}");


	}

}
