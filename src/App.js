// Styles
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
// Global components
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ToastContainer } from "react-toastify";

// Local components
import Searchbar from "./components/Searchbar";
import ImageGallery from "./components/ImageGallery";
import Modal from "./components/Modal";
import API from "./services/pixabay-api";

// Service variables
const modalRoot = document.querySelector("#modal-root");
const Status = {
  IDLE: "idle",
  PENDING: "pending",
  RESOLVED: "resolved",
  REJECTED: "rejected",
};

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pictures, setPictures] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);
  const [modal, setModal] = useState(false);
  const [largeImg, setLargeImg] = useState({
    url: "",
    alt: "",
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setStatus(Status.PENDING);
    fetchPictures();
  }, [query]);

  useEffect(() => {
    if (page === 1) {
      return;
    }

    fetchPictures();
  }, [page]);

  const fetchPictures = () => {
    API.fetchPictures(query, page)
      .then((res) => {
        setPictures((prevPictures) => [...prevPictures, ...res.hits]);
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

  const handleSearchSubmit = (searchQuery) => {
    setQuery(searchQuery);
    setPage(1);
    setPictures([]);
  };

  const handleImageClick = (imgSrc, alt) => {
    setLargeImg({ url: imgSrc, alt });
    toggleModal();
  };

  const toggleModal = () => {
    setModal((modal) => !modal);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="container">
      <Searchbar onSubmit={handleSearchSubmit} />
      <ImageGallery
        pictures={pictures}
        status={status}
        error={errorMsg}
        onClick={handleImageClick}
        onLoadMore={handleLoadMore}
      />
      <ToastContainer autoClose={3000} />
      {modal &&
        createPortal(
          <Modal src={largeImg.url} alt={largeImg.alt} onClose={toggleModal} />,
          modalRoot
        )}
    </div>
  );
}
