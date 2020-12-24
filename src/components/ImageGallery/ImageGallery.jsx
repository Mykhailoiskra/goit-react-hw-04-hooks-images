// Styles
import "./ImageGalleryStyles.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

// Utilities components
import { toast } from "react-toastify";
import PropTypes from "prop-types";

// Custom Components
import Loader from "react-loader-spinner";
import ImageGalleryItem from "../ImageGalleryItem";
import Button from "../Button";

export default function ImageGallery({
  onClick,
  pictures,
  error,
  status,
  onLoadMore,
}) {
  const handleImageClick = (evt) => {
    if (evt.target.tagName === "IMG") {
      onClick(evt.target.dataset.url, evt.target.alt);
    }
  };

  if (status === "idle") {
    return <div className="message">Let's find some nice pictures!</div>;
  }

  if (status === "pending") {
    return (
      <Loader
        type="ThreeDots"
        color="#00BFFF"
        height={120}
        width={120}
        style={{ textAlign: "center" }}
      />
    );
  }
  if (status === "rejected") {
    return toast.error(error);
  }

  if (status === "resolved" && pictures.length !== 0) {
    return (
      <>
        <ul className="ImageGallery" onClick={handleImageClick}>
          {pictures.map((picture) => (
            <ImageGalleryItem
              id={`${picture.id}`}
              url={picture.webformatURL}
              tags={picture.tags}
              largeImgUrl={picture.largeImageURL}
            />
          ))}
        </ul>
        <Button onClick={onLoadMore} />
      </>
    );
  } else {
    return <div className="message">We didn't find such picture...</div>;
  }
}

ImageGallery.propTypes = {
  pictures: PropTypes.array,
  status: PropTypes.string,
  error: PropTypes.string,
  onClick: PropTypes.func,
  onLoadMore: PropTypes.func,
};
