#include "DHT.h"
#include "ArduinoJson.h"

#define DHT_PIN     2
#define DHT_TYPE    DHT11 

DHT my_dht(DHT_PIN, DHT_TYPE);

void setup() {
	Serial.begin(9600);

	my_dht.begin();
}

void loop() {
	float temperature = my_dht.readTemperature();
	float humidity    = my_dht.readHumidity();

	DynamicJsonDocument doc(1024);

	doc["temperature"] = temperature;
	doc["humidity"] = humidity;

	serializeJson(doc, Serial);

	Serial.println();

	delay(60000);
}
