import { Button } from 'react-bootstrap';
import { BsX } from 'react-icons/bs';
import ItemComponetn from './ItemComponetn';

function RowComponent(props) {
  const type = props.type;
  return (
    <div className="RowComponent" data-testid="RowComponent--Drag">
      {type === undefined || type === 2 ? (
        <ItemComponetn
          min={0}
          max={360}
          id={props.id}
          onChange={props.onEdit}
          name="x"
          value={props.x}
          show_range={true}
        />
      ) : (
        <></>
      )}
      {type === undefined || type === 2 ? (
        <ItemComponetn
          min={0}
          max={360}
          id={props.id}
          onChange={props.onEdit}
          name="y"
          value={props.y}
          show_range={true}
        />
      ) : (
        <></>
      )}
      <ItemComponetn
        min={0}
        max={100}
        id={props.id}
        onChange={props.onEdit}
        name="rpm"
        value={props.rpm}
      />
      {type === undefined ? (
        <ItemComponetn
          min={0}
          max={10000}
          id={props.id}
          onChange={props.onEdit}
          name="wait"
          value={props.wait}
        />
      ) : (
        <></>
      )}
      {type === undefined ? (
        <ItemComponetn
          min={0}
          max={1}
          id={props.id}
          onChange={props.onEdit}
          name="laser"
          value={props.laser}
        />
      ) : (
        <></>
      )}
      {type === undefined ? (
        <Button
          data-testid="RowComponent--Delete"
          variant="dark"
          className="RowComponent--Button"
          onClick={(e) => props.onDelete(e, props.id)}>
          <BsX />
        </Button>
      ) : (
        <></>
      )}
      {type === 1 || type === 2 ? (
        <ItemComponetn
          min={0}
          max={1}
          id={props.id}
          onChange={props.onEdit}
          name="start_laser"
          value={props.start_laser}
        />
      ) : (
        <></>
      )}
      {type === 1 || type === 2 ? (
        <ItemComponetn
          min={0}
          max={1}
          id={props.id}
          onChange={props.onEdit}
          name="end_laser"
          value={props.end_laser}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default RowComponent;
