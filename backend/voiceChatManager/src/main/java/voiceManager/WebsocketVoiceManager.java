package voiceManager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "voiceManager")
public class WebsocketVoiceManager {

	public static void main(String[] args) {
		SpringApplication.run(WebsocketVoiceManager.class, args);
	}
}
