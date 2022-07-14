import React from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  BsChevronDoubleDown,
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
  BsChevronDoubleUp
} from 'react-icons/bs';
import { set_amount } from '../redux/reducers/adjustComponentSlice';
import { myBLEAdjustPosition } from '../BLE';

function AdjustComponent() {
  const amount = useSelector((state) => state.adjustComponent.amount);
  const dispatch = useDispatch();
  function handleAmountChange(result) {
    dispatch(set_amount(result.target.value));
  }
  //const encoder = new TextEncoder();
  async function handleSubmit(coord) {
    await myBLEAdjustPosition(5, 1, 1, coord.x, coord.y);
  }

  return (
    <div className="AdjustComponent">
      <div className="AdjustComponent--Row">
        <div className="AdjustComponent--Cell" />
        <div className="AdjustComponent--Cell">
          <Button
            data-testid="A"
            onClick={() => handleSubmit({ x: 0, y: amount })}
            variant="dark"
            className="AdjustComponent--Button">
            <BsChevronDoubleUp />
          </Button>
        </div>
        <div className="AdjustComponent--Cell" />
      </div>
      <div className="AdjustComponent--Row">
        <div className="AdjustComponent--Cell">
          <Button
            data-testid="B"
            onClick={() => handleSubmit({ x: -amount, y: 0 })}
            variant="dark"
            className="AdjustComponent--Button">
            <BsChevronDoubleLeft />
          </Button>
        </div>
        <div className="AdjustComponent--Cell">
          <div className="AdjustComponent--Input">
            <input
              data-testid="E"
              type="number"
              min="0"
              max="360"
              step="0.1"
              value={amount}
              onChange={handleAmountChange}
            />
          </div>
        </div>
        <div className="AdjustComponent--Cell">
          <Button
            data-testid="C"
            onClick={() => handleSubmit({ x: amount, y: 0 })}
            variant="dark"
            className="AdjustComponent--Button">
            <BsChevronDoubleRight />
          </Button>
        </div>
      </div>
      <div className="AdjustComponent--Row">
        <div className="AdjustComponent--Cell" />
        <div className="AdjustComponent--Cell">
          <Button
            data-testid="D"
            onClick={() => handleSubmit({ x: 0, y: -amount })}
            variant="dark"
            className="AdjustComponent--Button">
            <BsChevronDoubleDown />
          </Button>
        </div>
        <div className="AdjustComponent--Cell" />
      </div>
    </div>
  );
}

export default AdjustComponent;
