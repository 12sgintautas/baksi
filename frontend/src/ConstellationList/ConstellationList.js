import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { get_constellation, remove_constellation } from '../API';
import { myBLEWriteList } from '../BLE';
import { equatorial2horizontal, get_lst } from '../utils';
import AddConstellation from './AddConstellation';
import ConstellationRow from './ConstellationRow';
import EditConstellation from './EditConstellation';

function ConstellationList() {
  const dispatch = useDispatch();
  const stars = useSelector((state) => state.Stars.stars);
  const constellations = useSelector((state) => state.Constellations.constellations);
  const onRemove = async (e, id) => {
    await remove_constellation(dispatch, id);
  };
  const movement_type = useSelector((state) => state.BLE.upload_movement_type);
  const rpm = useSelector((state) => state.BLE.upload_speed);
  const wait = useSelector((state) => state.BLE.upload_wait_time);
  const onUpload = async (e, constellation) => {
    const laser = 0;
    const res = await get_constellation(constellation.id);
    const values = res[0].map((x) => {
      const lst = get_lst(23.9662);
      const res = equatorial2horizontal(x.right_ascension, x.declination, lst, 46.488);
      // const res = equatorial2horizontal(
      //   x.right_ascension,
      //   x.declination,
      //   23.96,
      //   54.9
      // );
      console.log(res);
      return {
        x: res.azimuth,
        y: res.altitude,
        rpm: rpm,
        laser: '1',
        wait: wait
      };
    });
    await myBLEWriteList(values, movement_type, rpm, wait, laser);
  };
  const [editConstellation, setEditConstellation] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const onEdit = (e, constellation) => {
    setEditModal(true);
    setEditConstellation(constellation);
  };
  return (
    <div>
      <AddConstellation stars={stars} />
      <EditConstellation
        stars={stars}
        constellation={editConstellation}
        modal={editModal}
        setModal={setEditModal}
      />
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Details</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {constellations.map((val) => {
            return (
              <ConstellationRow
                key={val.id}
                constellation={val}
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

export default ConstellationList;
