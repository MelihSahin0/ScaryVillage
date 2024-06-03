package votingManager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "votingManager")
public class StompWebsocketVotingManager {

	public static void main(String[] args) {

		SpringApplication.run(StompWebsocketVotingManager.class, args);
	}
}
