// Styles
import "./ImageGalleryStyles.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { createPortal } from "react-dom";
// Utilities components
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

// Custom Components
import Loader from "react-loader-spinner";
import ImageGalleryItem from "../ImageGalleryItem";
import Button from "../Button";
import API from "../../services/pixabay-api";
import Modal from "../Modal";

const Status = {
  IDLE: "idle",
  PENDING: "pending",
  RESOLVED: "resolved",
  REJECTED: "rejected",
};
const modalRoot = document.querySelector("#modal-root");

export default function ImageGallery({ onLoadMore, query, page }) {
  const [errorMsg, setErrorMsg] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);
  const [pictures, setPictures] = useState([]);
  const [largeImg, setLargeImg] = useState({
    url: "",
    alt: "",
  });
  const [modal, setModal] = useState(false);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setStatus(Status.PENDING);
    fetchPictures();
    // eslint-disable-next-line
  }, [query]);

  useEffect(() => {
    if (page === 1) {
      return;
    }
    fetchPictures();
    // eslint-disable-next-line
  }, [page]);

  const fetchPictures = () => {
    API.fetchPictures(query, page)
      .then((res) => {
        if (page === 1) {
          setPictures(res.hits);
        } else {
          setPictures((prevPictures) => [...prevPictures, ...res.hits]);
        }

        setStatus(Status.RESOLVED);
        if (page !== 1) {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
          });
        }
      })
      .catch((error) => {
        setErrorMsg(error);
        setStatus(Status.REJECTED);
      });
  };

  const handleImageClick = (event) => {
    const imgSrc = event.target.dataset.url;
    const alt = event.target.alt;
    setLargeImg({ url: imgSrc, alt });
    toggleModal();
  };
  const toggleModal = () => {
    setModal((modal) => !modal);
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
    return toast.error(errorMsg);
  }

  if (status === "resolved") {
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
        {modal &&
          createPortal(
            <Modal
              src={largeImg.url}
              alt={largeImg.alt}
              onClose={toggleModal}
            />,
            modalRoot
          )}
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
