package taskManager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "taskManager.extern")
public class StompWebsocketTaskManager {

	public static void main(String[] args) {

		SpringApplication.run(StompWebsocketTaskManager.class, args);
	}
}
