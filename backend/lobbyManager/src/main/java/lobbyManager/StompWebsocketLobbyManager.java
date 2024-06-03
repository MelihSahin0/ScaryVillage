package lobbyManager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication(scanBasePackages = "lobbyManager")
public class StompWebsocketLobbyManager {

	public static void main(String[] args) {
		SpringApplication.run(StompWebsocketLobbyManager.class, args);
	}
}
