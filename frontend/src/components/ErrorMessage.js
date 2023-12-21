const ErrorMessage = (props) => {
  const { errorMessage } = props;
  return (
    <>
      {errorMessage && (
        <p className="error-message">
          <i className="fa fa-exclamation" aria-hidden="true"></i>
          {errorMessage}
        </p>
      )}
    </>
  );
};

export default ErrorMessage;
