#include "BLE.h"
#include <ArduinoJson.h>
#include <AccelStepper.h>

BLE::BLE(AccelStepper* stepper_x, AccelStepper* stepper_y, int step_number) {
  _stepper_x = stepper_x;
  _stepper_y = stepper_y;
  _step_number = step_number;
}

void BLE::run(){
  //Serial.println(_destination_x);
  //Serial.println(_stepper_x->targetPosition());
  //Serial.println(_rpm);
  //Serial.println("--------------------------------");
  //Serial.println("==========================");
  //Serial.print("BLOCKED: ");
  //Serial.println(!_blocked);
  //Serial.println(_blocked_time);
  //Serial.println(millis());
  //Serial.println("==========================");
  if(!_blocked && _blocked_time <= millis()) updateValues();
  _stepper_x->moveTo(_destination_x);
  _stepper_y->moveTo(_destination_y);
  _stepper_x->setMaxSpeed(_rpm);
  _stepper_y->setMaxSpeed(_rpm);
  //_stepper_x->setSpeed(_rpm);
  //_stepper_y->setSpeed(_rpm);

  bool a = _stepper_x->distanceToGo() == 0;
  bool b = _stepper_y->distanceToGo() == 0;
  _stepper_x->run();
  _stepper_y->run();
}

void BLE::updateValues() {
  int x_now = _stepper_x->currentPosition();
  int y_now = _stepper_y->currentPosition();
  int x = _destination_x;
  int y = _destination_y;
  double rpm = _rpm;
  bool laser = _laser;
  bool absolute = _absolute;
  
  long start_next = _start_next;
  int next_index = _initial_current_point;
  bool dirr = _dirr;
  //Serial.println(_initial_current_point);
  //  if(_initial_points)Serial.println(_initial_points[_initial_current_point].x);
  //  Serial.println(_new_move_command);
  //  Serial.println("++++");
  switch(_move_type){
    case E_END_LIST:
    if(_new_move_command && _initial_current_point == 0){
      x = _initial_points[_initial_current_point].x;
      y = _initial_points[_initial_current_point].y;
      rpm = _initial_rpm;
      laser = getLaserState(_initial_laser, _global_laser_status);
      start_next = millis() + _initial_wait;
      if(_initial_length > 1) next_index = 1;
      dirr = true;
    } else if(x_now == _destination_x && y_now == _destination_y && _start_next <= millis()){
      x = _initial_points[_initial_current_point].x;
      y = _initial_points[_initial_current_point].y;
      rpm = _initial_points[_initial_current_point].rpm;
      laser = getLaserState(_initial_points[_initial_current_point].laser, _global_laser_status);
      start_next = millis() + _initial_points[_initial_current_point].wait_time;
      switch(_initial_style){
        case E_STOP_AT_END:
        if(_initial_current_point < _initial_length - 1) next_index = _initial_current_point + 1;
        break;
        case E_STOP_AT_START:
        if(_dirr){
            if(_initial_current_point < _initial_length - 1){
              next_index = _initial_current_point + 1;
            } else {
              next_index = _initial_current_point - 1;
              dirr = false;
            }
        } else {
            if(_initial_current_point > 0) next_index = _initial_current_point - 1;
        }
        break;
                  case E_LOOP_LINE:
          if(_dirr){
            if(_initial_current_point < _initial_length - 1){
              next_index = _initial_current_point + 1;
            } else {
              next_index = _initial_current_point - 1;
              dirr = false;
            }
          } else {
            if(_initial_current_point > 0){
              next_index = _initial_current_point - 1;
            }else {
              next_index = _initial_current_point + 1;
              dirr = true;
            }
          }
          break;
          case E_LOOP_CIRCLE:
          if(_initial_current_point < _initial_length - 1) {
            next_index = _initial_current_point + 1;
          } else {
            next_index = 0;
          }
          break;
      }
    }
    absolute = false;
    break;
    case E_GO_TO_00:
    x = 0;
    y = 0;
    rpm = _00_rpm;
    if(x_now == x && y_now == y){
      laser = getLaserState(_00_end_laser, _global_laser_status);
    } else {
      laser = getLaserState(_00_start_laser, _global_laser_status);
    }
    absolute = false;
    break;
    case E_ADJUST_POSITION:
    x = _adjust_x;
    y = _adjust_y;
    rpm = _adjust_rpm;
    if(x_now == x && y_now == y){
      laser = getLaserState(_adjust_end_laser, _global_laser_status);
    } else {
      laser = getLaserState(_adjust_start_laser, _global_laser_status);
    }
    absolute = true;
    break;
    case E_GO_TO_XY:
    x = _xy_x;
    y = _xy_y;
    rpm = _xy_rpm;
    if(x_now == x && y_now == y){
      laser = getLaserState(_xy_end_laser, _global_laser_status);
    } else {
      laser = getLaserState(_xy_start_laser, _global_laser_status);
    }
    absolute = false;
    break;
  }
  //Serial.print("x: ");
  //Serial.println(x);
  //Serial.print("!_blocked: ");
  //Serial.println(!_blocked);
  //Serial.print("_blocked_time <= millis(): ");
  //Serial.println(_blocked_time <= millis());
  if(!_blocked && _blocked_time <= millis()){
    if(_new_move_command) _new_move_command = false;
    _destination_x = x;
    _destination_y = y;
    _rpm = rpm;
    _laser = laser;
    _absolute = absolute;
    _start_next = start_next;
    _initial_current_point = next_index;
    _dirr = dirr;
  }
}

bool BLE::getLaserState(bool state, LaserStatusEnum type){
  if(type == E_OFF) return(false);
  if(type == E_ON) return(true);
  return state;
}

void BLE::handleNewMoveCommand() {
  _new_move_command = true;
  _move_type = _type;
  _blocked_time = millis() + 100;
  _blocked = false;
}

void BLE::print(){
  printLatestMessage();
  //printValues();
}

void BLE::printValues() {
  Serial.println("***** Device values: ");
  Serial.println(String("_destination_x: " + String(_destination_x)));
  Serial.println(String("_destination_y: " + String(_destination_y)));
  Serial.println(String("_rpm: " + String(_rpm)));
  Serial.println(String("_laser: " + String(_laser)));
  Serial.println(String("_absolute: " + String(_absolute)));
  Serial.println(String("_start_next: " + String(_start_next)));
  Serial.println(String("_initial_current_point: " + String(_initial_current_point)));
  Serial.println(String("_dirr: " + String(_dirr)));
  
}

void BLE::printLatestMessage() {
  switch(_type){
    case E_START_LIST:
    Serial.println("***** New list has started with these values: ");
    Serial.println(String("Total item number: " + String(_initial_length)));
    Serial.println(String("RPM: " + String(_initial_rpm)));
    Serial.println(String("Laser: " + String(_initial_laser)));
    Serial.println(String("Wait: " + String(_initial_wait)));
    Serial.println(String("Movemnt type: " + String(_initial_style)));
    break;
    case E_ADD_LIST_ITEM:
    Serial.println("***** New item has been added to list with these values: ");
    Serial.println(String("Item number: " + String(_initial_current_point - 1)));
    Serial.println(String("x: " + String(_initial_points[_initial_current_point - 1].x)));
    Serial.println(String("y: " + String(_initial_points[_initial_current_point - 1].y)));
    Serial.println(String("RPM: " + String(_initial_points[_initial_current_point - 1].rpm)));
    Serial.println(String("Laser: " + String(_initial_points[_initial_current_point - 1].laser)));
    Serial.println(String("Wait: " + String(_initial_points[_initial_current_point - 1].wait_time)));
    break;
    case E_END_LIST:
    Serial.println("***** All items has been added to list: ");
    printList();
    break;
    case E_GO_TO_00:
    Serial.println("***** Go to 00: ");
    Serial.println(String("RPM: " + String(_00_rpm)));
    Serial.println(String("Start Laser: " + String(_00_start_laser)));
    Serial.println(String("End Laser: " + String(_00_end_laser)));
    break;
    case E_ADJUST_POSITION:
    Serial.println("***** Adjust laser: ");
    Serial.println(String("x: " + String(_adjust_x)));
    Serial.println(String("y: " + String(_adjust_y)));
    Serial.println(String("RPM: " + String(_adjust_rpm)));
    Serial.println(String("Start Laser: " + String(_adjust_start_laser)));
    Serial.println(String("End Laser: " + String(_adjust_end_laser)));
    break;
    case E_TOGGLE_LASER:
    Serial.println("***** Togle laser: ");
    Serial.println(String("Laser: " + String(_global_laser_status)));
    break;
    case E_PAUSED:
    Serial.println("***** Paused: ");
    Serial.println(String("Pause: " + String(_paused)));
    break;
    case E_GO_TO_XY:
    Serial.println("***** Go to XY: ");
    Serial.println(String("x: " + String(_xy_x)));
    Serial.println(String("y: " + String(_xy_y)));
    Serial.println(String("RPM: " + String(_xy_rpm)));
    Serial.println(String("Start Laser: " + String(_xy_start_laser)));
    Serial.println(String("End Laser: " + String(_xy_end_laser)));
    break;
    default:
    Serial.println(String("There is no handling for messages of type:" + String(_type)));
  }
}

void BLE::printList() {
  for(int i = 0; i < _initial_length; i++){
    Serial.println(String("Item number: " + String(i)));
    Serial.println(String("x: " + String(_initial_points[i].x)));
    Serial.println(String("y: " + String(_initial_points[i].y)));
    Serial.println(String("RPM: " + String(_initial_points[i].rpm)));
    Serial.println(String("Laser: " + String(_initial_points[i].laser)));
    Serial.println(String("Wait: " + String(_initial_points[i].wait_time)));
  }
}

void BLE::processMessage(std::string message){
  DynamicJsonDocument json_message(1024);
  deserializeJson(json_message, message);
  String s_type = json_message["t"];
  _type = (CommandTypeEnum)s_type.toInt();
  //Serial.print("_type");
  //Serial.println(_type);
  switch(_type){
    //Serial.println(_blocked);
    //Serial.println(_blocked);
    case E_START_LIST:
    _blocked = true;
    processMessageStartList(json_message);
    break;
    case E_ADD_LIST_ITEM:
    processMessageNewListPoint(json_message);
    break;
    case E_END_LIST:
    processMessageEndList(json_message);
    //Serial.println(_blocked);
    handleNewMoveCommand();
    //Serial.println(_blocked);
    //Serial.println("Serial.println(_blocked);");
    break;
    case E_GO_TO_00:
    _blocked = true;
    processMessageBLEGoTo00(json_message);
    handleNewMoveCommand();
    break;
    case E_ADJUST_POSITION:
    _blocked = true;
    processMessageBLEAdjustPosition(json_message);
    handleNewMoveCommand();
    break;
    case E_TOGGLE_LASER:
    processMessageBLEToggleLaser(json_message);
    break;
    case E_PAUSED:
    processMessageBLEPause(json_message);
    break;
    case E_GO_TO_XY:
    _blocked = true;
    processMessageBLEGoToXY(json_message);
    handleNewMoveCommand();
    break;
    default:
    Serial.println(String("There is no handling for messages of type:" + s_type));
  }
}

void BLE::processMessageBLEPause(DynamicJsonDocument json_message){
  String s_paused = json_message["p"];
  _paused = s_paused.toInt() != 0;
}

void BLE::processMessageBLEToggleLaser(DynamicJsonDocument json_message){
  String s_global_laser_status = json_message["l"];
  _global_laser_status = (LaserStatusEnum)s_global_laser_status.toInt();
}

void BLE::processMessageBLEAdjustPosition(DynamicJsonDocument json_message){
  String s_rpm = json_message["r"];
  String s_start_laser = json_message["l"];
  String s_end_laser = json_message["k"];
  String s_x = json_message["x"];
  String s_y = json_message["y"];
  _adjust_rpm = getSpeed(s_rpm.toDouble());
  _adjust_start_laser = s_start_laser.toInt() != 0;
  _adjust_end_laser = s_end_laser.toInt() != 0;
  _adjust_x = getStepNumber(s_x.toDouble());
  _adjust_y = getStepNumber(s_y.toDouble());
}

void BLE::processMessageBLEGoToXY(DynamicJsonDocument json_message){
  String s_rpm = json_message["r"];
  String s_start_laser = json_message["l"];
  String s_end_laser = json_message["k"];
  String s_x = json_message["x"];
  String s_y = json_message["y"];
  _xy_rpm = getSpeed(s_rpm.toDouble());
  _xy_start_laser = s_start_laser.toInt() != 0;
  _xy_end_laser = s_end_laser.toInt() != 0;
  _xy_x = getStepNumber(s_x.toDouble());
  _xy_y = getStepNumber(s_y.toDouble());
}

void BLE::processMessageBLEGoTo00(DynamicJsonDocument json_message){
  String s_rpm = json_message["r"];
  String s_start_laser = json_message["l"];
  String s_end_laser = json_message["k"];
  _00_rpm = getSpeed(s_rpm.toDouble());
  _00_start_laser = s_start_laser.toInt() != 0;
  _00_end_laser = s_end_laser.toInt() != 0;
}

void BLE::processMessageStartList(DynamicJsonDocument json_message){
  String s_style = json_message["s"];
  String s_length = json_message["n"];
  String s_rpm = json_message["r"];
  String s_laser = json_message["l"];
  String s_wait = json_message["w"];
  _initial_style = (MovmentStylesEnum)s_style.toInt();
  _initial_length = s_length.toInt();
  _initial_rpm = getSpeed(s_rpm.toDouble());
  _initial_laser = s_laser.toInt() != 0;
  _initial_wait = s_wait.toInt();
  resetInitialPoints();
}

void BLE::processMessageNewListPoint(DynamicJsonDocument json_message){
  String s_rpm = json_message["r"];
  String s_laser = json_message["l"];
  String s_x = json_message["x"];
  String s_y = json_message["y"];
  String s_wait = json_message["w"];
  double rpm = getSpeed(s_rpm.toDouble());
  bool laser = s_laser.toInt() != 0;
  int x = getStepNumber(s_x.toDouble());
  int y = getStepNumber(s_y.toDouble());
  int wait = s_wait.toInt();
  _initial_points[_initial_current_point].x = x;
  _initial_points[_initial_current_point].y = y;
  _initial_points[_initial_current_point].rpm = rpm;
  _initial_points[_initial_current_point].wait_time = wait;
  _initial_points[_initial_current_point].laser = laser;
  _initial_current_point++;
}

void BLE::processMessageEndList(DynamicJsonDocument json_message){
  _initial_current_point = 0;
}

void BLE::resetInitialPoints(){
  delPoints(_initial_points);
  _initial_points = newPoints(_initial_length);
  _initial_current_point = 0;
}

Point* BLE::newPoints(int n){
  Point *points = (Point*)malloc(n * sizeof(Point));
  if (points == NULL) return NULL;
  return points;
}

void BLE::delPoints(Point *points){
  if (points != NULL) free(points);
}

int BLE::getStepNumber(double deg){
  double step = deg * _step_number / 360;
  return((int)step);
}

double BLE::getSpeed(double rpm){
  double sps = rpm * _step_number / 60;
  return(sps);
}
