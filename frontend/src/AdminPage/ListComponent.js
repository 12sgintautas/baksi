import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';
import { DragDropContext } from 'react-beautiful-dnd';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  add_coordinate,
  delete_coordinate,
  edit_coordinate,
  swap_coordinate,
} from '../redux/reducers/ListComponentSlice';
import RowComponent from './RowComponent';
import { myBLEWriteList } from '../BLE';

function ListComponent() {
  const coord_list = useSelector((state) => state.ListComponent.coordinates);
  const movement_type = useSelector((state) => state.BLE.upload_movement_type);
  const rpm = useSelector((state) => state.BLE.upload_speed);
  const wait = useSelector((state) => state.BLE.upload_wait_time);
  const laser = 1
  const dispatch = useDispatch();

  function handleOnDragEnd(e) {
    if (!e.destination) return;
    dispatch(
      swap_coordinate({
        source: e.source.index,
        destination: e.destination.index
      })
    );
  }
  function handleAdd() {
    dispatch(add_coordinate());
  }
  function handleEdit(e, id) {
    const target = { row: id, col: e.target.name, value: e.target.value };
    dispatch(edit_coordinate(target));
  }
  function handleDelete(_, id) {
    dispatch(delete_coordinate(id));
  }
  //const encoder = new TextEncoder();
  async function handleUpload() {
    await myBLEWriteList(coord_list, movement_type, rpm, wait, laser);
  }
  return (
    <div>
      <div className="ListComponent">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="MyList">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {coord_list.map((x, index) => {
                  return (
                    <Draggable key={x.id} draggableId={x.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}>
                          <RowComponent
                            id={x.id}
                            x={x.x}
                            y={x.y}
                            rpm={x.rpm}
                            wait={x.wait}
                            laser={x.laser}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}{' '}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="ListComponent--Buttons">
          <Button onClick={handleAdd}>Add</Button>
          <Button onClick={handleUpload}>Upload</Button>
        </div>
      </div>
    </div>
  );
}

export default ListComponent;
