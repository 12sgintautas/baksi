/* istanbul ignore file */
import { set_connected, set_laser, set_rpm, set_x, set_y } from './redux/reducers/BLESlice';

import { TextEncoder, TextDecoder } from 'text-decoding';

const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();

const BLE_NAME = 'AAA';
const BLE_SERVICE_UUID = '64c92038-9f3f-4caa-a936-fbb540954ca6';
const BLE_READ_CHARACTERISTIC_UUID = 'b2fb5790-bc3b-49fd-9c64-9aca752c4bf2';
const BLE_WRITE_CHARACTERISTIC_UUID = '4267d4b1-88b9-4681-b09f-f8faf160a338';

let BLE_DEVICE = null;
let BLE_SERVICE = null;
let BLE_READ_CHARACTERISTIC = null;
let BLE_WRITE_CHARACTERISTIC = null;

/**
 * Checks if BLE is supportrted by browser.
 * @returns Boolen value indicating if BLE is supported.
 */
const isBLESupported = () => {
  const res = !(
    typeof navigator.bluetooth === 'undefined' && typeof navigator.getDevices === 'undefined'
  );
  if (!res) alert('Web Bluetooth is not supported by your browser');
  return res;
};

/**
 * Cheks if BLE is avalible on machine.
 * @returns Boolen value indicating if BLE is avlaible on machine.
 */
const isBLEAvailable = async () => {
  const res = isBLESupported() && (await navigator.bluetooth.getAvailability());
  if (res && !(await navigator.bluetooth.getAvailability()))
    alert('Web Bluetooth is not by your device');
  return res;
};

/**
 * Check if BLE device is connected.
 * @param {BluetoothDevice} BLEDevice The BluetoothDevice interface of the Web Bluetooth API.
 * @returns Boolen value indicating if BLE device is connected.
 */
const isBLEDeviceConnected = (BLEDevice) => {
  if (BLEDevice === null) return false;
  return BLEDevice.gatt.connected;
};

/**
 * Gets BLE device.
 * If device is chased, then it is used, else user is asked to sellect device from a list of avalible devices.
 * @param {string} name The name of a device.
 * @param {string} UUID The UUID of a service that will be used.
 * @returns BLE device or null if a error occured.
 */
const getBLEDevice = async (name, UUID) => {
  if (!(await isBLEAvailable())) return null;
  const devices = await navigator.bluetooth.getDevices();
  const device_a = devices.find((e) => e.name === name);
  if (typeof device_a !== 'undefined') return device_a;
  try {
    const device_b = await navigator.bluetooth.requestDevice({
      filters: [{ name: name }],
      optionalServices: [UUID]
    });
    return device_b;
  } catch (error) {
    return null;
  }
};

/**
 * Gets BLE Service.
 * @param {BluetoothDevice} BLEDevice The BluetoothDevice interface of the Web Bluetooth API.
 * @param {string} UUID The UUID of a service.
 * @returns BLE service or null if a error occured.
 */
const getBLEService = async (BLEDevice, UUID) => {
  if (!isBLEDeviceConnected(BLEDevice)) return null;
  const service = await BLEDevice.gatt.getPrimaryService(UUID);
  return service;
};

/**
 * Gets BLE Service.
 * @param {BluetoothRemoteGATTService} BLE BLE service.
 * @param {string} UUID The UUID of a characteristic.
 * @returns BLE characteristic or null if a error occured.
 */
const getBLECharacteristic = async (BLEService, UUID) => {
  if (BLEService === null) return null;
  if (!isBLEDeviceConnected(BLEService.device)) return null;
  const characteristic = await BLEService.getCharacteristic(UUID);
  return characteristic;
};

/**
 * Connects to BLE device.
 * @param {BluetoothDevice} BLEDevice The BluetoothDevice interface of the Web Bluetooth API.
 * @returns Boolen value indicating if device is connected.
 */
const connectBLEDevice = async (BLEDevice) => {
  if (BLEDevice === null) return false;
  if (BLEDevice.gatt.connected) return true;
  try {
    await BLEDevice.gatt.connect();
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Disconnects from BLE device.
 * @param {BluetoothDevice} BLEDevice The BluetoothDevice interface of the Web Bluetooth API.
 * @returns Boolen value indicating if device is connected.
 */
const disconnectBLEDevice = async (BLEDevice) => {
  if (BLEDevice === null) return false;
  if (!BLEDevice.gatt.connected) return false;
  await BLEDevice.gatt.disconnect();
  return false;
};

/**
 * Writes value to BLE Characteristic
 * @param {BluetoothRemoteGATTCharacteristic} BLECharacteristic BLE characteristic
 * @param {JSON} value Value
 * @returns Writen value or null if error occured
 */
const writeBLECharacteristic = async (BLECharacteristic, value) => {
  if (BLECharacteristic === null) return null;
  if (!isBLEDeviceConnected(BLECharacteristic.service.device)) return null;
  await BLECharacteristic.writeValue(ENCODER.encode(JSON.stringify(value)));
  return value;
};

/**
 * Reads value from BLE Characteristic
 * @param {BluetoothRemoteGATTCharacteristic} BLECharacteristic BLE characteristic
 * @returns Read value in JSON format or null if error occured
 */
const readBLECharacteristic = async (BLECharacteristic) => {
  if (BLECharacteristic === null) return null;
  if (!isBLEDeviceConnected(BLECharacteristic.service.device)) return null;
  const value = await BLECharacteristic.readValue();
  return JSON.parse(DECODER.decode(value));
};

/**
 * Initializes BLE_DEVICE and BLE_SERVICE global variables.
 * @returns Boolen value indicating if device is connected.
 */
const myBLEConnect = async () => {
  if (BLE_DEVICE === null) {
    BLE_DEVICE = await getBLEDevice(BLE_NAME, BLE_SERVICE_UUID);
  }
  if (!isBLEDeviceConnected(BLE_DEVICE)) {
    await connectBLEDevice(BLE_DEVICE);
    BLE_SERVICE = null;
    BLE_READ_CHARACTERISTIC = null;
    BLE_WRITE_CHARACTERISTIC = null;
  }
  if (BLE_SERVICE === null) {
    BLE_SERVICE = await getBLEService(BLE_DEVICE, BLE_SERVICE_UUID);
  }
  return isBLEDeviceConnected(BLE_DEVICE);
};

/**
 * Initializes BLE_DEVICE, BLE_SERVICE, BLE_READ_CHARACTERISTIC and reads it's read characteristic.
 * @returns Read value in JSON format or null if error occured
 */
const myBLERead = async () => {
  if (!(await myBLEConnect())) return null;
  if (BLE_READ_CHARACTERISTIC === null) {
    BLE_READ_CHARACTERISTIC = await getBLECharacteristic(BLE_SERVICE, BLE_READ_CHARACTERISTIC_UUID);
  }
  return await readBLECharacteristic(BLE_READ_CHARACTERISTIC);
};

/**
 * Initializes BLE_DEVICE, BLE_SERVICE, BLE_WRITE_CHARACTERISTIC and writes it to write characteristic.
 * @param {JSON} value Value
 * @returns Writen value or null if error occured
 */
const myBLEWrite = async (value) => {
  if (BLE_DEVICE === null) {
    alert('Connect laser device');
    return null;
  } else {
    if (!(await myBLEConnect())) return null;
    if (BLE_WRITE_CHARACTERISTIC === null) {
      BLE_WRITE_CHARACTERISTIC = await getBLECharacteristic(
        BLE_SERVICE,
        BLE_WRITE_CHARACTERISTIC_UUID
      );
    }
    return await writeBLECharacteristic(BLE_WRITE_CHARACTERISTIC, value);
  }
};

const isMyBLEDeviceConnected = () => {
  return isBLEDeviceConnected(BLE_DEVICE);
};

/**
 * Disconects from BLE_DEVICE
 * @returns Boolen value indicating if device is connected.
 */
const myBLEDisconnect = async () => {
  const res = await disconnectBLEDevice(BLE_DEVICE);
  return res;
};

let BLE_INTERVAL_ID = null;

/**
 * Set the id of BLE daemon / interval
 * @param {Number} id Id of interval
 * @returns ID of interval
 */
const setBLEIntervalID = (id) => {
  BLE_INTERVAL_ID = id;
  return id;
};

/**
 * Get the id of BLE daemon / interval
 * @returns ID of interval
 */
const getBLEIntervalID = () => {
  return BLE_INTERVAL_ID;
};

/**
 * Initialises BLE
 * @param {Boolean} enabled Boolean value indicating if BLE should be enabled / connected
 * @param {*} dispatch Dispatch fuction of react-redux
 */
const initBLEInterval = async (enabled, dispatch) => {
  if (enabled) {
    if (getBLEIntervalID() === null) {
      console.log('Interval Started');
      await myBLEConnect();
      const BLEIntervalID = setInterval(async () => {
        const connected = isMyBLEDeviceConnected();
        const data = await Promise.race([
          myBLERead(),
          new Promise((res) => setTimeout(() => res(null), 300))
        ]);
        const x = data !== null ? data.x : null;
        const y = data !== null ? data.y : null;
        const rpm = data !== null ? data.rpm : null;
        const laser = data !== null ? data.laser : null;
        dispatch(set_connected(connected));
        dispatch(set_x(x));
        dispatch(set_y(y));
        dispatch(set_rpm(rpm));
        dispatch(set_laser(laser));
      }, 500);
      setBLEIntervalID(BLEIntervalID);
    }
  } else {
    const BLEIntervalID = getBLEIntervalID();
    if (BLEIntervalID !== null) {
      console.log('Interval ended');
      clearInterval(BLEIntervalID);
      setBLEIntervalID(null);
      await myBLEDisconnect();
      dispatch(set_connected(null));
      dispatch(set_x(null));
      dispatch(set_y(null));
      dispatch(set_rpm(null));
      dispatch(set_laser(null));
    }
  }
};

/*
t - messgae type
  0 - Start list
  1 - List itme
  2 - End list
  3 - Go to 0,0
  4 - Adjust position
  5 - Set laser on or off

If t == 0:
  r - initial rpm
  l - initial laser status (on/of)
  w - initial wait time
  n - number of points
  s - type of movment
    0 - Go trough point list and stop at the end
    1 - Go trough point list, backtrac and stop at the start
    2 - Go trough point list, backtrac and loop
    3 - Go trough point list jump to start and loop

If t == 1:
  x - X value to go to
  y - Y value to go to
  r - Speed (RMP) at witch to go to x,y
  l - Should laser be on while going to x,y
  w - How long shoud laser whait at x,y

If t == 3:
  r - intial RPM
  l - initial laser on/off
  k - when at 0,0 laser on/off

if t == 4:
  x - Adjust by x
  y - Adjust by y
  r - initial adjust rpm
  l - initial laser on/off
  k - when at 0,0 laser on/off

if t == 5:
  l - Golbal lazer setting if 0 allways of, if 1 allways on, if -1 depends on message type
*/

const myBLEWriteList = async (values, movement_type, rpm, wait, laser) => {
  const message = [
    { t: 0, r: rpm, s: movement_type, l: laser, w: wait, n: values.length },
    ...values.map((v) => ({
      t: 1,
      x: v.x,
      y: -v.y,
      r: v.rpm,
      l: v.laser,
      w: v.wait
    })),
    { t: 2 }
  ];
  console.log(message);
  if (BLE_DEVICE === null) {
    alert('Connect laser device');
  } else {
    for (const v of message) {
      await myBLEWrite(v);
    }
  }
};

/**
 * Set laser to 0,0.
 * @param {Number} rpm RPM value at which the laser will travel to the 0,0 position. e.g. rpm = 2.
 * @param {Number} start_laser Value indicating if laser should be on or off while going to 0,0. 0 if off, else on. e.g. start_laser = 0.
 * @param {Number} end_laser Value indicating if laser should be on or off while at 0,0. 0 if off, else on. e.g. end_laser = 1.
 * @returns Message that was sent to device or null if an error occured.
 */
const myBLEGoTo00 = async (rpm, start_laser, end_laser) => {
  const message = { t: 3, r: rpm, l: start_laser, k: end_laser };
  const res = await myBLEWrite(message);
  return res;
};

/**
 * Adjust laser by specified amount. (While adjusting, coordinates will not change).
 * @param {Number} rpm RPM value at which the laser will travel to the 0,0 position. e.g. rpm = 2.
 * @param {Number} start_laser Value indicating if laser should be on or off while going to 0,0. 0 if off, else on. e.g. start_laser = 0.
 * @param {Number} end_laser Value indicating if laser should be on or off while at 0,0. 0 if off, else on. e.g. end_laser = 1.
 * @param {Number} x The amount of degrees by which laser will be adjusted at x axis. (-360 <= x <= 360). e.g. x = 15.5
 * @param {Number} y The amount of degrees by which laser will be adjusted at y axis. (-360 <= y <= 360). e.g. y = -150.5
 * @returns Message that was sent to device or null if an error occured.
 */
const myBLEAdjustPosition = async (rpm, start_laser, end_laser, x, y) => {
  const message = { t: 4, r: rpm, l: start_laser, k: end_laser, x: x, y: -y };
  const res = await myBLEWrite(message);
  return res;
};

/**
 * Set global laser status.
 * @param {Number} laser_status Value indicating global laser status. 0 if always off, 1 if always on, else laser is set by current action. e.g. laser_status = 1.
 * @returns Message that was sent to device or null if an error occured.
 */
const myBLEToggleLaser = async (laser_status) => {
  const message = { t: 5, l: laser_status };
  const res = await myBLEWrite(message);
  return res;
};

/**
 * Pause BLE.
 * @param {Number} pause_status Value indicating id device should be paused. 0 if not, 1 if paused.
 * @returns Message that was sent to device or null if an error occured.
 */
const myBLEPause = async (pause_status) => {
  const message = { t: 6, p: pause_status };
  const res = await myBLEWrite(message);
  return res;
};

/**
 * Set laser to x, y.
 * @param {Number} rpm RPM value at which the laser will travel to the 0,0 position. e.g. rpm = 2.
 * @param {Number} start_laser Value indicating if laser should be on or off while going to 0,0. 0 if off, else on. e.g. start_laser = 0.
 * @param {Number} end_laser Value indicating if laser should be on or off while at 0,0. 0 if off, else on. e.g. end_laser = 1.
 * @param {Number} x x axis position. (-360 <= x <= 360). e.g. x = 15.5
 * @param {Number} y y axis position. e.g. y = -150.5
 * @returns Message that was sent to device or null if an error occured.
 */
const myBLEGoToXY = async (rpm, start_laser, end_laser, x, y) => {
  const message = { t: 7, r: rpm, l: start_laser, k: end_laser, x: x, y: -y };
  const res = await myBLEWrite(message);
  return res;
};

export {
  myBLEGoToXY,
  myBLEPause,
  myBLEGoTo00,
  myBLEAdjustPosition,
  myBLEToggleLaser,
  myBLEWriteList,
  initBLEInterval,
  isBLESupported,
  isBLEAvailable,
  isMyBLEDeviceConnected,
  myBLERead,
  myBLEWrite
};
