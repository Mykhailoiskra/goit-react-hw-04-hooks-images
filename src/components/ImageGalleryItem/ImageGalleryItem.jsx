import "./ImageGalleryItemStyles.css";
import PropTypes from "prop-types";

const ImageGalleryItem = ({ id, url, tags, largeImgUrl }) => {
  return (
    <li className="ImageGalleryItem" key={id}>
      <img
        src={url}
        alt={tags}
        className="ImageGalleryItem-image"
        data-url={largeImgUrl}
      />
    </li>
  );
};

export default ImageGalleryItem;

ImageGalleryItem.propTypes = {
  id: PropTypes.string,
  url: PropTypes.string,
  tags: PropTypes.string,
  largeImgUrl: PropTypes.string,
};
