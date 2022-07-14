function ItemComponetn(props) {
  return (
    <div className="ItemComponetn">
      <div className="ItemComponetn--Text">
        <p>{props.name}:</p>
      </div>
      <div className="ItemComponetn--Number">
        <input
          data-testid="RowComponent--Number"
          name={props.name}
          type="number"
          value={props.value}
          onChange={(e) => props.onChange(e, props.id)}
          min={props.min}
          max={props.max}
          step="0.01"
        />
      </div>
      {props.show_range ? (
        <div className="ItemComponetn--Range">
          <input
            name={props.name}
            type="range"
            value={props.value}
            onChange={(e) => props.onChange(e, props.id)}
            min={props.min}
            max={props.max}
            step="0.01"
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ItemComponetn;
