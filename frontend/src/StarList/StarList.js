import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { remove_old_star } from '../API';
import { myBLEGoToXY } from '../BLE';
import { equatorial2horizontal, get_lst } from '../utils';
import AddStar from './AddStar';
import EditStar from './EditStar';
import StarRow from './StarRow';

function StarList() {
  const rpm = useSelector((state) => state.BLE.upload_speed);
  const dispatch = useDispatch();
  const stars = useSelector((state) => state.Stars.stars);
  const onRemove = async (e, id) => {
    const res = await remove_old_star(dispatch, id);
    if (res !== null) {
      const message = "Star can't be removed it is used at these constalations:\n";
      alert(message + res.map((x) => x.name + '\n'));
    }
  };
  const onUpload = async (e, star) => {
    const lst = get_lst(23.9662);
    const res = equatorial2horizontal(star.right_ascension, star.declination, lst, 46.488);
    // const res = equatorial2horizontal(
    //   star.right_ascension,
    //   star.declination,
    //   23.96,
    //   54.9
    // );
    console.log(res);
    await myBLEGoToXY(rpm, 0, 1, res.azimuth, res.altitude);
  };
  const [editStar, setEditStar] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const onEdit = (e, star) => {
    setEditModal(true);
    setEditStar(star);
  };
  return (
    <div>
      <AddStar />
      <EditStar star={editStar} modal={editModal} setModal={setEditModal} />
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Details</th>
            <th>Right ascension</th>
            <th>Declination</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {stars.map((val) => {
            return (
              <StarRow
                key={val.id}
                star={val}
                onRemove={onRemove}
                onUpload={onUpload}
                onEdit={onEdit}
              />
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default StarList;
