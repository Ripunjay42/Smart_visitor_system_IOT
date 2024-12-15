#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <SPI.h>
#include <MFRC522.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <map> // To store the last status of each card

// WiFi Credentials
#define WIFI_SSID "monk"
#define WIFI_PASSWORD "harami12"

// Firebase Credentials
#define API_KEY "AIzaSyCoOs4PcILMRk1MR7dqg5DQ9L_W4oZauIM"
#define DATABASE_URL "https://iotproject-5d691-default-rtdb.asia-southeast1.firebasedatabase.app"

// RFID Pins Configuration
#define SS_PIN D4   // SDA
#define RST_PIN D3  // RST

// NTP Client for timestamp
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

// Firebase Objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

MFRC522 mfrc522(SS_PIN, RST_PIN);  // Create MFRC522 instance

// Global map to track the last status of each card
std::map<String, String> cardStatusMap;

void setup() {
  Serial.begin(115200);

  // WiFi Connection
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connected to Wi-Fi with IP: ");
  Serial.println(WiFi.localIP());

  // Initialize NTP Client for timestamp
  timeClient.begin();
  timeClient.setTimeOffset(19800); // Adjust for your timezone (e.g., +5:30 for India)

  // Firebase Configuration
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  // Email and Password for Authentication
  String email = "your_email1@example.com";
  String password = "your_password1";

  // Set up user authentication
  auth.user.email = email.c_str();
  auth.user.password = password.c_str();

  // Initialize Firebase
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Check Firebase connection and authentication
  if (Firebase.ready()) {
    Serial.println("Firebase connection established!");
  } else {
    Serial.println("Firebase connection failed!");
    Serial.println(fbdo.errorReason());
  }

  // Initialize RFID Reader
  SPI.begin();
  mfrc522.PCD_Init();
  Serial.println("RFID Reader Initialized");
}

void loop() {
  // Update time
  timeClient.update();

  // Look for new cards
  if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial()) {
    delay(50);  // Small delay to avoid overloading the processor
    return;  // No new card detected, exit loop
  }

  // Get UID from the card
  String cardUID = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    cardUID += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
    cardUID += String(mfrc522.uid.uidByte[i], HEX);
  }

  // Get current timestamp (epoch time in seconds)
  unsigned long epochTime = timeClient.getEpochTime();

  // Prepare Firebase path
  String path = "/visitors/" + cardUID;

  // Determine the current status based on the card's previous status
  String currentStatus;
  if (cardStatusMap[cardUID] == "checked_in") {
    currentStatus = "checked_out";
  } else {
    currentStatus = "checked_in";
  }

  // Update the card's last status in the map
  cardStatusMap[cardUID] = currentStatus;

  // Create JSON object for Firebase
  FirebaseJson json;
  json.set("uid", cardUID);
  json.set("timestamp", epochTime);
  json.set("status", currentStatus);

  // Send data to Firebase
  if (Firebase.pushJSON(fbdo, path, json)) {
    Serial.println("Data sent to Firebase successfully");
    Serial.print("Card UID: ");
    Serial.println(cardUID);
    Serial.print("Status: ");
    Serial.println(currentStatus);
  } else {
    // Handle Firebase push failure
    Serial.println("Firebase push failed");
    Serial.println(fbdo.errorReason()); // Print Firebase error message
  }

  // Halt PICC (stop reading)
  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();

  delay(2000); // Delay to prevent multiple reads of the same card
}
