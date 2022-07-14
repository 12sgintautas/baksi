import {
  dtd_print,
  dth_print,
  dtr,
  equatorial2horizontal,
  equatorial_to_horizontal,
  getLst,
  get_closest_star,
  get_deg_dist,
  get_lst,
  ra_da_2_x_y,
  rtd,
  unique
} from '../utils';

test('Test dth_print', () => {
  const result = dth_print(180);
  expect(result).toBe('12h0m0s');
});

test('Test dtd_print', () => {
  const result = dtd_print(180);
  expect(result).toBe('180°0′0″');
});

test('Test rtd', () => {
  const result = rtd(Math.PI);
  expect(result).toBe(180);
});

test('Test dtr', () => {
  const result = dtr(180);
  expect(result).toBe(Math.PI);
});

test('Test get_lst', () => {
  const result1 = dth_print(get_lst(46.488, new Date('2022-05-07 04:20').getTime()));
  expect(result1).toBe('19h23m37s');
  const result2 = dth_print(get_lst(46.488, new Date('2022-05-07 08:20').getTime()));
  expect(result2).toBe('23h24m16s');
});

test('Test ra_da_2_x_y', () => {
  const result1 = ra_da_2_x_y(50, 60);
  expect(result1).toEqual({ x: 0.12767407385316298, y: 0.10713126828108989 });
  const result2 = ra_da_2_x_y(0, 90);
  expect(result2).toEqual({ x: 0, y: 0 });
  const result3 = ra_da_2_x_y(0, 80);
  expect(result3).toEqual({ x: 0, y: 0.05555555555555555 });
});

test('Test get_closest_star', () => {
  const stars = [
    { right_ascension: 150, declination: 60 },
    { right_ascension: 160, declination: 70 },
    { right_ascension: 160, declination: 75 }
  ];
  const right_ascension = 155;
  const declination = 71;
  const result1 = get_closest_star(stars, right_ascension, declination);
  expect(result1).toEqual({ declination: 70, right_ascension: 160 });
});

test('Test get_deg_dist', () => {
  const result1 = get_deg_dist(10, 90);
  expect(result1).toBe(80);
});

test('Test unique', () => {
  const list = [
    { a: 's', b: 1 },
    { a: 's', b: 2 },
    { a: 's', b: 1 },
    { a: 's', b: 2 },
    { a: 's', b: 3 }
  ];
  const result1 = unique(list, 'b');
  expect(result1).toEqual([
    { a: 's', b: 1 },
    { a: 's', b: 2 },
    { a: 's', b: 3 }
  ]);
});

test('Test getLst', () => {
  const lst = getLst('2022-05-07 05:02', 23.9662);
  expect(lst).toEqual(278.9129578851618);
  const lst1 = getLst('2022-05-07 05:02', 43.9662);
  expect(lst1).toEqual(298.9129578851618);
});

test('Test equatorial2horizontal', () => {
  const lst = getLst('2022-05-07 04:02', 23.9662);
  const res = equatorial2horizontal(206.75, 49.3, lst, 46.488);
  expect(res).toEqual({ altitude: 52.51842470366535, azimuth: 295.84314052014076 });
});
