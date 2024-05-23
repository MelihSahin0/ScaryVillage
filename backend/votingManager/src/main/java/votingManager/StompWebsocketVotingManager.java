package votingManager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "votingManager.extern")
public class StompWebsocketVotingManager {

	public static void main(String[] args) {

		SpringApplication.run(StompWebsocketVotingManager.class, args);
	}
}
