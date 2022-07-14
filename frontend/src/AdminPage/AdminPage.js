import React from 'react';
import ListComponent from './ListComponent';
import { myBLEGoToXY, myBLEAdjustPosition } from '../BLE';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';

import { set_adjust } from '../redux/reducers/otherBLESlice';
import RowComponent from './RowComponent';

function AdminPage() {
  const dispatch = useDispatch();

  const t_adjust = useSelector((state) => state.otherBLE.t_adjust);

  const handle_adjust = (e) => {
    const val = { col: e.target.name, value: e.target.value };
    dispatch(set_adjust(val));
  };

  const handleGoToXY = async () => {
    await myBLEGoToXY(
      t_adjust.rpm,
      t_adjust.start_laser,
      t_adjust.end_laser,
      t_adjust.x,
      t_adjust.y
    );
  };
  const handleAdjust = async () => {
    await myBLEAdjustPosition(
      t_adjust.rpm,
      t_adjust.start_laser,
      t_adjust.end_laser,
      t_adjust.x,
      t_adjust.y
    );
  };

  return (
    <>
      {/* <div className="Atooltip">
        Calibrate laser possition
        <span className="Atooltiptext">
          Adjust laser possition without chaging it's coordinates
        </span>
      </div>
      <AdjustComponent /> */}
      <br />
      <div className="Atooltip">
        Move laser to possition
        <span className="Atooltiptext">
          Define list of coordinates and upload them to device. If Loop is true, then the list of
          coordinates will loop. Go to (0;0) sets laser to 0, 0
        </span>
      </div>
      <ListComponent />
      <Button className="AdminPage--Margin" onClick={handleGoToXY}>
        Go to XY
      </Button>
      <Button className="AdminPage--Margin" onClick={handleAdjust}>
        Calibrate
      </Button>
      <RowComponent
        type={2}
        id={-1}
        x={t_adjust.x}
        y={t_adjust.y}
        rpm={t_adjust.rpm}
        start_laser={t_adjust.start_laser}
        end_laser={t_adjust.end_laser}
        onEdit={handle_adjust}
      />
    </>
  );
}

export default AdminPage;
