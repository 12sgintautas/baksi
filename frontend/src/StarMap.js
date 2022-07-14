import React, { useEffect, useRef, useState } from 'react';

import star_map from './star_map.png';
import { dtr, rtd } from './utils';

const StarMap = (props) => {
  const img_declination_error = 26;

  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [offsetTop, setOffsetTop] = useState(0);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    setHeight(ref.current.clientHeight);
    setWidth(ref.current.clientWidth);
    setOffsetTop(ref.current.offsetTop);
    setOffsetLeft(ref.current.offsetLeft);
  }, [ref]);

  // Specific for this component because the dimensions of a page is needed
  const ra_dec_2_x_y = (right_ascension, declination) => {
    const len = (90 - declination) / (90 - img_declination_error);
    const rad = dtr(right_ascension);
    const x = Math.round(((len * Math.sin(rad) + 1) / 2) * width - 4) + offsetLeft;
    const y = Math.round((1 - (len * Math.cos(rad) + 1) / 2) * height - 4) + offsetTop;
    return { x, y };
  };

  const onMapClick = (e) => {
    const bounds = e.target.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    const p_x = (x / bounds.width) * 2 - 1;
    const p_y = 1 - (y / bounds.height) * 2;
    const right_ascension_tmp = rtd(Math.atan2(p_x, p_y));
    const right_ascension =
      right_ascension_tmp > 0 ? right_ascension_tmp : 360 + right_ascension_tmp;
    const declination =
      img_declination_error + (90 - img_declination_error) * (1 - Math.hypot(p_x, p_y));
    props.onClick({
      right_ascension: right_ascension,
      declination: declination
    });
  };

  return (
    <div id="StarMap--Map" ref={ref} className="StarMap" onClick={onMapClick}>
      {props.stars.map((val) => {
        const res = ra_dec_2_x_y(val.right_ascension, val.declination);
        return (
          <React.Fragment key={val.id}>
            <div className="Point" style={{ top: res.y + 'px', left: res.x + 'px' }}></div>
          </React.Fragment>
        );
      })}
      <img data-testid="StarMap--Map" alt="" src={star_map} />
    </div>
  );
};

export default StarMap;
