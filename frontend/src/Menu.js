import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  set_enabled,
  set_upload_movement_type,
  set_upload_pasue_time,
  set_upload_speed,
  set_upload_wait_time
} from './redux/reducers/BLESlice';
import BootstrapSwitchButtonReact from 'bootstrap-switch-button-react';
import { Button } from 'react-bootstrap';
import { dtd_print } from './utils';
import { myBLEGoTo00, myBLEPause, myBLEToggleLaser } from './BLE';

function Menu() {
  const s_enabled = useSelector((state) => state.BLE.enabled);

  const s_connected = useSelector((state) => state.BLE.connected);
  const s_x = useSelector((state) => state.BLE.x);
  const s_y = useSelector((state) => state.BLE.y);
  const s_rpm = useSelector((state) => state.BLE.rpm);
  const s_laser = useSelector((state) => state.BLE.laser);

  const dispatch = useDispatch();
  const handleOnConnect = async (e) => {
    dispatch(set_enabled(e));
  };

  const onLaserSpeedChange = (e) => {
    dispatch(set_upload_speed(e.target.value));
  };
  const onMovmentTypeChange = (e) => {
    dispatch(set_upload_movement_type(e.target.value));
  };
  const onWaitTimeChange = (e) => {
    dispatch(set_upload_wait_time(e.target.value));
  };
  // const onPasueTimeChange = (e) => {
  //   dispatch(set_upload_pasue_time(e.target.value));
  // };

  const upload_speed = useSelector((state) => state.BLE.upload_speed);
  const upload_movement_type = useSelector((state) => state.BLE.upload_movement_type);
  const upload_wait_time = useSelector((state) => state.BLE.upload_wait_time);
  const upload_pasue_time = useSelector((state) => state.BLE.upload_pasue_time);

  const onPauseClick = async () => {
    dispatch(set_upload_pasue_time((upload_pasue_time + 1) % 2));
    await myBLEPause(upload_pasue_time);
  };

  const onGoTO00Click = async () => {
    await myBLEGoTo00(upload_speed, 1, 1);
  };

  const onTogleLaser = async (e) => {
    await myBLEToggleLaser(e.target.value);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <div className="NawBar--Columns">
          <div className="NawBar--Rows">
            <Nav className="me-auto">
              <Nav.Link id="Menu--Constellations" as={Link} to="/Constellations">
                Constellations
              </Nav.Link>
              <Nav.Link id="Menu--Stars" as={Link} to="/Stars">
                Stars
              </Nav.Link>
              <Nav.Link id="Menu--Admin" as={Link} to="/AdminPage">
                Admin
              </Nav.Link>
            </Nav>
            <div className="Navbar--Connected">
              {s_enabled ? (
                <>
                  <div className="MyNavItem">
                    <div>x:</div>
                    <div>{dtd_print(s_x)}</div>
                  </div>
                  <div className="MyNavItem">
                    <div>y:</div>
                    <div>{dtd_print(s_y)}</div>
                  </div>
                  <div className="MyNavItem">
                    <div>RPM:</div>
                    <div>{s_rpm}</div>
                  </div>
                  <div className="MyNavItem">
                    <div>Laser:</div>
                    <div className={s_laser ? 'IndicatorOn' : 'IndicatorOff'} />
                  </div>
                  <div className="MyNavItem">
                    <div>Connected:</div>
                    <div className={s_connected ? 'IndicatorOn' : 'IndicatorOff'} />
                  </div>
                </>
              ) : (
                <></>
              )}
              <BootstrapSwitchButtonReact
                id="Menu--Connect"
                onlabel="Disconnect"
                offlabel="Connect"
                width="120"
                onChange={handleOnConnect}
                checked={s_enabled}
              />
            </div>
          </div>
          <div className="NawBar--Rows">
            <div className="Navbar--Left">
              <div className="Navbar--Input">
                <div>Laser speed:</div>
                <input
                  data-testid="Menu--RPM"
                  id="Menu--LaserSpeed"
                  value={upload_speed}
                  onChange={onLaserSpeedChange}
                  type="number"
                  className="form-control"
                />
              </div>
              <div className="Navbar--Input">
                <div>Movement type:</div>
                <select
                  data-testid="Menu--MType"
                  value={upload_movement_type}
                  onChange={onMovmentTypeChange}
                  className="form-control"
                  id="movement_type"
                  name="movement_type">
                  <option value="0">Normal</option>
                  <option value="1">Backtack</option>
                  <option value="2">Back and forth</option>
                  <option value="3">Loop</option>
                </select>
              </div>
              <div className="Navbar--Input">
                <div>Wait time:</div>
                <input
                  data-testid="Menu--Wait"
                  value={upload_wait_time}
                  onChange={onWaitTimeChange}
                  type="number"
                  className="form-control"
                />
              </div>
            </div>
            <div className="Navbar--Connected">
              {s_enabled ? (
                <>
                  {/* <div className="Navbar--Input">
                    <div>Pause time:</div>
                    <input
                      value={upload_pasue_time}
                      onChange={onPasueTimeChange}
                      type="number"
                      className="form-control"
                    />
                  </div> */}
                  <Button onClick={onPauseClick} className="NawBar--Button" variant="secondary">
                    {upload_pasue_time == 1 ? "Pause":"Unpause"}
                  </Button>
                  <Button onClick={onGoTO00Click} className="NawBar--Button" variant="secondary">
                    Go to 0;0
                  </Button>
                  <div className="Navbar--Input">
                    <div>Toggle laser:</div>
                    <select
                      onChange={onTogleLaser}
                      className="form-control"
                      id="laser_type"
                      name="laser_type">
                      <option value="2">Default</option>
                      <option value="1">On</option>
                      <option value="0">Off</option>
                    </select>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </Navbar>
    </>
  );
}

export default Menu;
