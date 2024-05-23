package playerManager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "playerManager")
public class StompWebsocketPlayerManager {

	public static void main(String[] args) {
		SpringApplication.run(StompWebsocketPlayerManager.class, args);
	}
}
