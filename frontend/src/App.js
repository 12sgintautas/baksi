import './App.css';
import React, { useEffect } from 'react';
import AdminPage from './AdminPage/AdminPage';
import { Routes, Route } from 'react-router-dom';
import { initBLEInterval } from './BLE';
import { useDispatch, useSelector } from 'react-redux';
import { init_constellations } from './redux/reducers/ConstellationsSlice';
import { get_all_constellations, get_all_stars } from './API';
import StarList from './StarList/StarList';
import Menu from './Menu';
import { init_stars } from './redux/reducers/StarsSlice';
import ConstellationList from './ConstellationList/ConstellationList';

const update_vals = async (dispatch, s_enabled) => {
  dispatch(init_stars(await get_all_stars()));
  dispatch(init_constellations(await get_all_constellations()));
  initBLEInterval(s_enabled, dispatch);
};

function App() {
  const dispatch = useDispatch();
  const s_enabled = useSelector((state) => state.BLE.enabled);
  useEffect(() => {
    update_vals(dispatch, s_enabled);
  }, [dispatch, s_enabled]);
  return (
    <>
      <Menu />
      <Routes>
        <Route path="/" element={<ConstellationList />} />
        <Route path="/AdminPage" element={<AdminPage />} />
        <Route path="/Stars" element={<StarList />} />
        <Route path="/Constellations" element={<ConstellationList />} />
      </Routes>
    </>
  );
}

export default App;
