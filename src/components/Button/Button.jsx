import "./ButtonStyles.css";
import PropTypes from "prop-types";

function Button({ onClick }) {
  return (
    <button type="button" className="Button" onClick={onClick}>
      Load More
    </button>
  );
}

export default Button;

Button.propTypes = {
  onClick: PropTypes.func,
};
