import React, { useEffect, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';
import { DragDropContext } from 'react-beautiful-dnd';
import { Button, Modal, Table } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { edit_old_constellation } from '../API';
import StarMap from '../StarMap';
import StarRow from '../StarList/StarRow';
import { get_closest_star, unique } from '../utils';

function EditConstellation(props) {
  const constellation = props.constellation;
  const modal = props.modal;
  const setModal = props.setModal;

  const all_stars = props.stars.map((x, i) => ({ ...x, index: i }));

  const dispatch = useDispatch();
  const closeModal = () => {
    setModal(false);
  };
  const saveModal = async () => {
    await edit_old_constellation(
      dispatch,
      constellation.id,
      name,
      details,
      stars.map((x) => x.id)
    );
    setModal(false);
  };

  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [stars, setStars] = useState([]);

  useEffect(() => {
    if (constellation !== null) {
      setName(constellation.name);
      setDetails(constellation.additional_info);
      const tmp = constellation.stars;
      const tmp_stars = tmp.map((x, i) => ({
        ...all_stars.filter((y) => y.id === x)[0],
        index: i
      }));
      setStars(tmp_stars);
    }
  }, [constellation]);

  const editName = (e) => {
    setName(e.target.value);
  };
  const editDetails = (e) => {
    setDetails(e.target.value);
  };
  const addStar = (e) => {
    const ra = e.right_ascension;
    const de = e.declination;
    const index = stars.length === 0 ? 5 : Math.max(...stars.map((x) => x.index)) + 1;
    const star = { ...get_closest_star(all_stars, ra, de), index: index };
    setStars([...stars, star]);
  };
  const clearStars = () => {
    const tmp_stars = constellation.stars.map((x, i) => ({
      ...all_stars.filter((y) => y.id === x)[0],
      index: i
    }));
    setStars(tmp_stars);
    setName(constellation.name);
    setDetails(constellation.additional_info);
  };
  const handleOnDragEnd = (e) => {
    const source = e.source.index;
    if (e.destination !== null) {
      const destination = e.destination.index;
      const tmp = Array.from(stars);
      const [reorderStars] = tmp.splice(source, 1);
      tmp.splice(destination, 0, reorderStars);
      setStars(tmp);
    }
  };
  const onRemove = async (e, index) => {
    const tmp = stars.filter((x) => x.index !== index);
    setStars(tmp);
  };
  return (
    <>
      <Modal dialogClassName="ConstellationList--Modal" show={modal}>
        <Modal.Header>
          <Modal.Title>Edit {constellation ? constellation.name : ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-outline">
            <label className="form-label">Name</label>
            <input
              data-testid="EditConstellation--Name"
              onChange={editName}
              value={name}
              type="text"
              className="form-control"
            />
          </div>
          <div className="form-outline">
            <label className="form-label">Details</label>
            <textarea
              data-testid="EditConstellation--Details"
              onChange={editDetails}
              value={details}
              type="text"
              className="form-control"
            />
          </div>
          <StarMap
            onClick={addStar}
            stars={unique(stars, 'id').map((x) => ({
              right_ascension: x.right_ascension,
              declination: x.declination,
              id: x.id
            }))}
          />
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Details</th>
                <th>Right ascension</th>
                <th>Declination</th>
                <th></th>
              </tr>
            </thead>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="AddConstellationStarList">
                {(provided) => (
                  <tbody {...provided.droppableProps} ref={provided.innerRef}>
                    {stars.map((star, index) => {
                      return (
                        <Draggable
                          key={star.index}
                          draggableId={star.index.toString()}
                          index={index}>
                          {(provided) => (
                            <StarRow star={star} provided={provided} onRemove={onRemove} />
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </tbody>
                )}
              </Droppable>
            </DragDropContext>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={clearStars}>
            Clear
          </Button>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={saveModal}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditConstellation;
