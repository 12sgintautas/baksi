import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  add_constellation,
  add_new_star,
  add_stars,
  edit_old_constellation,
  edit_old_star,
  get_all_constellations,
  get_all_stars,
  get_constellation,
  get_satar_by_id,
  remove_constellation,
  remove_old_star
} from '../API';
import { initBLEInterval, myBLERead, myBLEWriteList } from '../BLE';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test('Test add_new_star', async () => {
  const store = mockStore({ todos: [] });
  const dispatch = store.dispatch;
  const id = await add_new_star(dispatch, 'name', 'additional_info', 160, 70);
  expect(typeof id).toBe('number');
  const star1 = await get_satar_by_id(id);
  expect(star1).toEqual({
    additional_info: 'additional_info',
    declination: 70,
    id: id,
    name: 'name',
    right_ascension: 160,
    start_time: null
  });
  const all_stars = await get_all_stars();
  expect(all_stars.length).toBeGreaterThan(0);
  await remove_old_star(dispatch, id);
  const star2 = await get_satar_by_id(id);
  expect(star2).toEqual('');
});

test('Test add_stars', async () => {
  const store = mockStore({ todos: [] });
  const dispatch = store.dispatch;
  const ids = await add_stars([
    { additional_info: 'additional_info', declination: 70, name: 'name', right_ascension: 160 },
    { additional_info: 'additional_info', declination: 90, name: 'name', right_ascension: 160 }
  ]);
  expect(ids.length).toBe(2);
  const star1 = await get_satar_by_id(ids[0]);
  const star2 = await get_satar_by_id(ids[1]);
  expect(star1).toEqual({
    additional_info: 'additional_info',
    declination: 70,
    id: ids[0],
    name: 'name',
    right_ascension: 160,
    start_time: null
  });
  expect(star2).toEqual({
    additional_info: 'additional_info',
    declination: 90,
    id: ids[1],
    name: 'name',
    right_ascension: 160,
    start_time: null
  });
  await edit_old_star(dispatch, ids[1], 'a', 'a', 90, 90);
  const star5 = await get_satar_by_id(ids[1]);
  expect(star5).toEqual({
    additional_info: 'a',
    declination: 90,
    id: ids[1],
    name: 'a',
    right_ascension: 90,
    start_time: null
  });
  await remove_old_star(dispatch, ids[0]);
  await remove_old_star(dispatch, ids[1]);
  const star3 = await get_satar_by_id(ids[0]);
  const star4 = await get_satar_by_id(ids[1]);
  expect(star3).toEqual('');
  expect(star4).toEqual('');
});

test('Test add_constalation', async () => {
  const store = mockStore({ todos: [] });
  const dispatch = store.dispatch;

  const ids = await add_stars([
    { additional_info: 'additional_info', declination: 70, name: 'name', right_ascension: 160 },
    { additional_info: 'additional_info', declination: 90, name: 'name', right_ascension: 160 }
  ]);
  expect(ids.length).toBe(2);
  const star1 = await get_satar_by_id(ids[0]);
  const star2 = await get_satar_by_id(ids[1]);
  expect(star1).toEqual({
    additional_info: 'additional_info',
    declination: 70,
    id: ids[0],
    name: 'name',
    right_ascension: 160,
    start_time: null
  });
  expect(star2).toEqual({
    additional_info: 'additional_info',
    declination: 90,
    id: ids[1],
    name: 'name',
    right_ascension: 160,
    start_time: null
  });

  const constellation_id = await add_constellation(
    dispatch,
    'name',
    'additional_info',
    ids.map((x) => ({ id: x }))
  );
  await remove_old_star(dispatch, ids[0]);
  await remove_old_star(dispatch, ids[1]);
  expect(star1).toEqual({
    additional_info: 'additional_info',
    declination: 70,
    id: ids[0],
    name: 'name',
    right_ascension: 160,
    start_time: null
  });
  expect(star2).toEqual({
    additional_info: 'additional_info',
    declination: 90,
    id: ids[1],
    name: 'name',
    right_ascension: 160,
    start_time: null
  });
  expect(typeof constellation_id).toBe('number');
  const constellations = await get_all_constellations();
  expect(constellations.length).toBeGreaterThan(0);
  const constellation1 = await get_constellation(constellation_id);
  const constellation2 = await edit_old_constellation(dispatch, constellation_id, '', '', []);
  await remove_constellation(dispatch, constellation_id);
  const constellation3 = await get_constellation(constellation_id);
  expect(constellation3).toEqual([[], {}]);

  await remove_old_star(dispatch, ids[0]);
  await remove_old_star(dispatch, ids[1]);
  const star3 = await get_satar_by_id(ids[0]);
  const star4 = await get_satar_by_id(ids[1]);
  expect(star3).toEqual('');
  expect(star4).toEqual('');
});
