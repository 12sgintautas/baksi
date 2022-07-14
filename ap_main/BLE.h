#ifndef BLE_h
#define BLE_h
#include <ArduinoJson.h>
#include <AccelStepper.h>

enum CommandTypeEnum {
  E_START_LIST = 0, E_ADD_LIST_ITEM = 1, E_END_LIST = 2,
  E_GO_TO_XY = 7,
  E_GO_TO_00 = 3,
  E_ADJUST_POSITION = 4,
  E_TOGGLE_LASER = 5,
  E_PAUSED = 6
};

enum LaserStatusEnum {
  E_OFF = 0,
  E_ON = 1,
  E_OTHER = 2
};

enum MovmentStylesEnum {
  E_STOP_AT_END = 0,
  E_STOP_AT_START = 1,
  E_LOOP_LINE = 2,
  E_LOOP_CIRCLE = 3
};

struct Point {
  int x;
  int y;
  double rpm;
  int wait_time;
  bool laser;
};

class BLE {
  public:
    BLE(AccelStepper* stepper_x, AccelStepper* stepper_y, int step_number);
	  void print();
	  void processMessage(std::string message);
	  void updateValues();
    void run();
	
  private:
    int getStepNumber(double deg);
    double getSpeed(double rpm);
  
    void printValues();
    void printLatestMessage();
    void printList();

    int _step_number;
    AccelStepper* _stepper_x;
    AccelStepper* _stepper_y;

    int _destination_x;
    int _destination_y;
    double _rpm;
    bool _laser;
    bool _absolute;
    bool _paused;

    long _start_next;
    bool _dirr;
    
    bool _new_move_command;
    CommandTypeEnum _move_type;
    CommandTypeEnum _type;
    bool _blocked;
    long _blocked_time;
    void handleNewMoveCommand();
    bool getLaserState(bool state, LaserStatusEnum type);

    LaserStatusEnum _global_laser_status;
	  void processMessageBLEToggleLaser(DynamicJsonDocument json_message);

    void processMessageBLEPause(DynamicJsonDocument json_message);

    int _xy_x;
    int _xy_y;
    double _xy_rpm;
    bool _xy_start_laser;
    bool _xy_end_laser;
    void processMessageBLEGoToXY(DynamicJsonDocument json_message);

    int _adjust_x;
    int _adjust_y;
    double _adjust_rpm;
    bool _adjust_start_laser;
    bool _adjust_end_laser;
	  void processMessageBLEAdjustPosition(DynamicJsonDocument json_message);

    double _00_rpm;
    bool _00_start_laser;
    bool _00_end_laser;
	  void processMessageBLEGoTo00(DynamicJsonDocument json_message);

    MovmentStylesEnum _initial_style;
    int _initial_length;
    double _initial_rpm;
    bool _initial_laser;
    int _initial_wait;
    Point* _initial_points;
    int _initial_current_point;
    void resetInitialPoints();
    Point* newPoints(int n);
    void delPoints(Point *points);
	  void processMessageStartList(DynamicJsonDocument json_message);
	  void processMessageNewListPoint(DynamicJsonDocument json_message);
	  void processMessageEndList(DynamicJsonDocument json_message);	
};
#endif
