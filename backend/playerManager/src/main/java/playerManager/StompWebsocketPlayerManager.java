package playerManager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "playerManager.extern")
public class StompWebsocketPlayerManager {

	public static void main(String[] args) {

		SpringApplication.run(StompWebsocketPlayerManager.class, args);
	}
}
