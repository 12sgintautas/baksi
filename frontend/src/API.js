import axios from 'axios';
import {
  add_constellations,
  edit_constellations,
  remove_constellations
} from './redux/reducers/ConstellationsSlice';
import { add_star, remove_star, edit_star } from './redux/reducers/StarsSlice';
const domain = "http://localhost:5001/";
//const domain = 'https://astropuctum.herokuapp.com/';

const get_all_stars = async () => {
  const stars = await axios({
    method: 'GET',
    url: domain + 'stars'
  });
  return stars.data;
};

const get_all_constellations = async () => {
  const constellations = await axios({
    method: 'GET',
    url: domain + 'constellations'
  });
  return constellations.data;
};

const get_constellation = async (id) => {
  const constellations = await axios.get(domain + 'constellation/' + id);
  return constellations.data;
};

const add_stars = async (stars) => {
  const ids = await Promise.all(
    stars.map(async (star) => {
      const res = await axios.post(domain + 'star', {
        name: star.name,
        additional_info: star.additional_info,
        right_ascension: star.right_ascension,
        declination: star.declination
      });
      return res.data.id;
    })
  );
  return ids;
};

const add_constellation = async (dispatch, name, additional_info, stars) => {
  const stars_ids = stars.map((x) => x.id);
  const res = await axios.post(domain + 'constellation', {
    name: name,
    additional_info: additional_info,
    stars: stars_ids
  });
  const id = res.data.id;
  dispatch(
    add_constellations({
      id: id,
      name: name,
      additional_info: additional_info,
      stars: stars_ids
    })
  );
  return id;
};

const edit_old_constellation = async (dispatch, id, name, additional_info, stars) => {
  const res = await axios.put(domain + 'constellation/' + id, {
    name: name,
    additional_info: additional_info,
    stars: stars
  });
  res.data.stars = stars;
  dispatch(edit_constellations(res.data));
};

const remove_constellation = async (dispatch, id) => {
  await axios.delete(domain + 'constellation/soft/' + id);
  dispatch(remove_constellations(id));
};

const add_new_star = async (dispatch, name, additional_info, right_ascension, declination) => {
  const res = await axios.post(domain + 'star', {
    name: name,
    additional_info: additional_info,
    right_ascension: right_ascension,
    declination: declination
  });
  const id = res.data.id;
  dispatch(
    add_star({
      id: id,
      name: name,
      additional_info: additional_info,
      right_ascension: right_ascension,
      declination: declination
    })
  );
  return id;
};

const edit_old_star = async (dispatch, id, name, additional_info, right_ascension, declination) => {
  await axios.put(domain + 'star/' + id, {
    name: name,
    additional_info: additional_info,
    right_ascension: right_ascension,
    declination: declination
  });
  dispatch(
    edit_star({
      id: id,
      name: name,
      additional_info: additional_info,
      right_ascension: right_ascension,
      declination: declination
    })
  );
};

const remove_old_star = async (dispatch, id) => {
  const res = await axios.delete(domain + 'star/' + id);
  if (res.status === 204) {
    dispatch(remove_star(id));
    return null;
  } else if (res.status === 200) {
    return res.data;
  }
};

const get_satar_by_id = async (id) => {
  const res = await axios.get(domain + 'star/' + id);
  return res.data;
};

export {
  edit_old_constellation,
  edit_old_star,
  remove_old_star,
  add_new_star,
  get_all_stars,
  get_all_constellations,
  add_constellation,
  remove_constellation,
  get_constellation,
  add_stars,
  get_satar_by_id
};
