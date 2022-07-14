// BLE Server - http://www.neilkolban.com/esp32/docs/cpp_utils/html/class_b_l_e_server.html#a4e73a6a59133915aa7212d3e87f60084
// BLE github - https://github.com/nkolban/ESP32_BLE_Arduino
// BLE Connected device addres - https://www.esp32.com/viewtopic.php?t=8525
// BLE Disconect device - https://github.com/nkolban/esp32-snippets/issues/387

#include "BLE.h"



#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <BLEAddress.h>

#include <ArduinoJson.h>

#define SERVICE_UUID        "64c92038-9f3f-4caa-a936-fbb540954ca6"
#define READ_CHARACTERISTIC_UUID "b2fb5790-bc3b-49fd-9c64-9aca752c4bf2"
#define WRITE_CHARACTERISTIC_UUID "4267d4b1-88b9-4681-b09f-f8faf160a338"
#define NAME "AAA"
const int c_ble_timeout = 3000;


#include <AccelStepper.h>

#define IN5 4
#define IN6 16
#define IN7 17
#define IN8 18


#define IN1 26
#define IN2 25
#define IN3 33
#define IN4 32

#define FULLSTEP 8

const int steps_per_revolution = 2048 * 2;
AccelStepper stepper_a(FULLSTEP, IN1, IN3, IN2, IN4);
AccelStepper stepper_b(FULLSTEP, IN5, IN7, IN6, IN8);

BLE MyBLE(&stepper_a, &stepper_b, steps_per_revolution);

BLEServer* g_ble_p_server;
BLEService *p_service;
BLECharacteristic *p_read_characteristic;
BLECharacteristic *p_write_characteristic;
unsigned long g_ble_last_callback = 0;
bool g_ble_connected = false;




struct Point *newPoint (size_t sz) {
    struct Point *point = (struct Point*)malloc(sz * sizeof(struct Point));
    if (point == NULL) return NULL;
    return point;
}

void delPoint (struct Point *point) {
  if (point != NULL) free (point);
}

void printPoints(struct Point *p, int n) {
  Serial.println("Points:");
  for(int i = 0; i < n; i++) {
    Serial.print("x: ");
    Serial.print(p[i].x);
    Serial.print("|  y: ");
    Serial.print(p[i].y);
    Serial.print("|  rpm: ");
    Serial.print(p[i].rpm);
    Serial.print("|  w: ");
    Serial.print(p[i].wait_time);
    Serial.print("|  laser: ");
    Serial.println(p[i].laser);
  }
}

bool blocked = false;
bool laser_go = false;
int points_len;
struct Point *points;






class MyBLEServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* p_server, esp_ble_gatts_cb_param_t *p_param) {
    String addres = BLEAddress(p_param->connect.remote_bda).toString().c_str();
    Serial.println(String("Connect: " + addres));
    g_ble_last_callback = millis();
    g_ble_connected = true;
  }
  void onDisconnect(BLEServer* p_server) {
    Serial.println("Disconnect: ");
    
    BLEDevice::startAdvertising();
    g_ble_connected = false;
  }
};


bool laser = 0;
class MyBLEReadCharacteristicCallbacks: public BLECharacteristicCallbacks {
  void onRead(BLECharacteristic *pCharacteristic) {
    laser = random(100) % 2 == 0;
  
    Serial.print("Read: ");
    String str = String("{\"x\":" + String(stepper_a.currentPosition()) + ", \"y\":" + String(stepper_b.currentPosition()) + ", \"rpm\":" + String(stepper_a.speed()) + ", \"laser\":" + String(laser) + "}");
    Serial.println(str);
    pCharacteristic->setValue(str.c_str());
    g_ble_last_callback = millis();
  }
};

class MyBLEWriteCharacteristicCallbacks: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) {
    std::string value = pCharacteristic->getValue();
    String tmp = String(value.c_str());
    //Serial.println(tmp);
    MyBLE.processMessage(value);
    //MyBLE.print();
    
    g_ble_last_callback = millis();
  }
};

void setup() {
  
  Serial.begin(115200);
  while(!Serial);

  stepper_a.setAcceleration(steps_per_revolution);
  stepper_b.setAcceleration(steps_per_revolution);

  //MyBLE.print();

  BLEDevice::init(NAME);
  
  g_ble_p_server = BLEDevice::createServer();
  g_ble_p_server->setCallbacks(new MyBLEServerCallbacks());

  p_service = g_ble_p_server->createService(SERVICE_UUID);

  p_read_characteristic = p_service->createCharacteristic(
    READ_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_WRITE
  );
  p_read_characteristic->setCallbacks(new MyBLEReadCharacteristicCallbacks());
  
  p_write_characteristic = p_service->createCharacteristic(
    WRITE_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_WRITE
  );
  p_write_characteristic->setCallbacks(new MyBLEWriteCharacteristicCallbacks());

  p_service->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);

  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  
  BLEDevice::startAdvertising();
}

void loop() {
  MyBLE.run();
  //delay(1000);
  //MyBLE.print();
}
