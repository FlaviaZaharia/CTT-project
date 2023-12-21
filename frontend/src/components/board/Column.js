const Column = (props) => {
  return (
    <div className="Column">
      <div className="Column__title">{props.title}</div>
      {props.children}
    </div>
  );
};

export default Column;
