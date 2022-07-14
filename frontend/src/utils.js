const dth_print = (deg) => {
  const sec = deg * 4 * 60;
  const min = sec / 60;
  const hou = min / 60;
  return Math.floor(hou) + 'h' + (Math.floor(min) % 60) + 'm' + (Math.floor(sec) % 60) + 's';
};

const dtd_print = (deg) => {
  const min = (deg - Math.floor(deg)) * 60;
  const sec = (min - Math.floor(min)) * 60;
  return Math.floor(deg) + '°' + Math.floor(min) + '′' + Math.floor(sec) + '″';
};

const rtd = (rad) => (rad * 180.0) / Math.PI;
const dtr = (deg) => (deg * Math.PI) / 180.0;

const get_lst = (longitude, utc = new Date().getTime()) => {
  const j2000 = Date.UTC(2000, 1, 1, 11, 58, 55, 816);
  const diff = utc - j2000;
  const days = diff / 86400000;
  const gst = (days * 360.98562628 + 280.46061837) % 360;
  const lst = (gst + longitude) % 360;
  return lst + 30;
};

const ra_da_2_x_y = (ra, da) => {
  const len = (90 - da) / 180;
  const rad = dtr(ra);
  const x = len * Math.sin(rad);
  const y = len * Math.cos(rad);
  return { x, y };
};

const get_closest_star = (stars, right_ascension, declination) => {
  const xy = ra_da_2_x_y(right_ascension, declination);
  const dist = stars.map((x) => {
    const tmp = ra_da_2_x_y(x.right_ascension, x.declination);
    const res = Math.hypot(get_deg_dist(xy.x, tmp.x), get_deg_dist(xy.y, tmp.y));
    return res;
  });
  const min = Math.min(...dist);
  const index = dist.indexOf(min);
  return stars[index];
};

const get_deg_dist = (a, b) => {
  const res = Math.min(
    ...[Math.abs((a % 360) - (b % 360)), Math.abs(((a + 180) % 360) - ((b + 180) % 360))]
  );
  return res;
};

const unique = (arr, comp) => {
  const unique = arr
    .map((e) => e[comp])
    .map((e, i, final) => final.indexOf(e) === i && i)
    .filter((e) => arr[e])
    .map((e) => arr[e]);
  return unique;
};

export {
  unique,
  get_closest_star,
  dth_print,
  dtd_print,
  rtd,
  dtr,
  get_lst,
  ra_da_2_x_y,
  get_deg_dist
};

export const getLst = (date, longitude) => {
  const st = get_lst(longitude, new Date(date).getTime());
  return st;
};

export const equatorial2horizontal = (ra, dec, lst, lat) => {
  const _ra = dtr(ra);
  const _dec = dtr(dec);
  const _lst = dtr(lst);
  const _lat = dtr(lat);
  const hour_angle = _lst - _ra;
  const temp =
    Math.sin(_dec) * Math.sin(_lat) + Math.cos(_dec) * Math.cos(_lat) * Math.cos(hour_angle);
  const altitude = Math.asin(temp);
  const temp2 = (Math.sin(hour_angle) * Math.cos(_dec)) / Math.cos(altitude);
  const altitude2 = rtd(altitude);
  const azimuth = -rtd(Math.asin(temp2));
  const azz = azimuth < 0 ? 360 + azimuth : azimuth;
  ////console.log({altitude2, azz})
  return { altitude: altitude2, azimuth: azz };
};
