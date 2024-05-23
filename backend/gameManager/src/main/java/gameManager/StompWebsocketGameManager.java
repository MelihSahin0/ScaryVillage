package gameManager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "gameManager")
public class StompWebsocketGameManager {

	public static void main(String[] args) {
		SpringApplication.run(StompWebsocketGameManager.class, args);
	}
}
