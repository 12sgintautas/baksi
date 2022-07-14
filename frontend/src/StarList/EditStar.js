import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { edit_old_star } from '../API';
import StarMap from '../StarMap';
import { dth_print, dtd_print } from '../utils';

function EditStar(props) {
  const star = props.star;
  const modal = props.modal;
  const setModal = props.setModal;
  const dispatch = useDispatch();
  const closeModal = () => {
    setModal(false);
  };
  const saveModal = async () => {
    await edit_old_star(dispatch, star.id, name, details, rightAscension, declination);
    setModal(false);
  };
  const clearModal = () => {
    setRightAscension(0);
    setDeclination(90);
    setDetails('');
    setName('');
  };

  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [rightAscension, setRightAscension] = useState(0);
  const [declination, setDeclination] = useState(90);

  useEffect(() => {
    setName(star !== null ? star.name : '');
    setDetails(star !== null ? star.additional_info : '');
    setRightAscension(star !== null ? star.right_ascension : 0);
    setDeclination(star !== null ? star.declination : 0);
  }, [star]);

  const editName = (e) => {
    if (e.target.value.length < 20) setName(e.target.value);
  };
  const editDetails = (e) => {
    setDetails(e.target.value);
  };
  const editCoords = (e) => {
    setRightAscension(e.right_ascension);
    setDeclination(e.declination);
  };
  return (
    <Modal dialogClassName="ConstellationList--Modal" show={modal}>
      <Modal.Header>
        <Modal.Title>Edit {star !== null ? star.name : ''}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-outline">
          <label className="form-label">Name</label>
          <input
            data-testid="EditStar--Name"
            onChange={editName}
            value={name}
            type="text"
            className="form-control"
          />
        </div>
        <div className="form-outline">
          <label className="form-label">Details</label>
          <textarea
            data-testid="EditStar--Details"
            onChange={editDetails}
            value={details}
            type="text"
            className="form-control"
          />
        </div>
        <div className="form-outline">
          <label className="form-label">Right ascension</label>
          <label className="form-control">{dth_print(rightAscension)}</label>
        </div>
        <div className="form-outline">
          <label className="form-label">Declination</label>
          <label className="form-control">{dtd_print(declination)}</label>
        </div>
        <StarMap
          onClick={editCoords}
          stars={[
            {
              right_ascension: rightAscension,
              declination: declination,
              id: 0
            }
          ]}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button variant="secondary" onClick={clearModal}>
          Clear
        </Button>
        <Button variant="primary" onClick={saveModal}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditStar;
