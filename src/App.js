import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Component } from "react";
import { createPortal } from "react-dom";
import { ToastContainer } from "react-toastify";
import Searchbar from "./components/Searchbar";
import ImageGallery from "./components/ImageGallery";
import Modal from "./components/Modal";
import API from "./services/pixabay-api";

const modalRoot = document.querySelector("#modal-root");
export default class App extends Component {
  state = {
    query: "",
    page: 1,
    pictures: [],
    error: null,
    status: "idle",
    showModal: false,
    modalContent: {
      url: "",
      alt: "",
    },
  };

  componentDidUpdate(prevProps, prevState) {
    const prevQuery = prevState.query;
    const currentQuery = this.state.query;

    if (prevQuery !== currentQuery) {
      this.setState({ status: "pending" });

      this.fetchPictures();
    }

    if (prevState.page !== this.state.page) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  }

  fetchPictures = () => {
    API.fetchPictures(this.state.query, this.state.page)
      .then((res) =>
        this.setState(({ pictures, page }) => ({
          pictures: [...pictures, ...res.hits],
          status: "resolved",
          page: page + 1,
        }))
      )
      .catch((error) => this.setState({ error, status: "rejected" }));
  };

  handleSearchSubmit = (searchQuery) => {
    this.setState({ query: searchQuery, page: 1, pictures: [] });
  };

  handleImageClick = (imgSrc, alt) => {
    this.setState({ modalContent: { url: imgSrc, alt } });
    this.toggleModal();
  };

  handleLoadMore = () => {
    this.fetchPictures();
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  render() {
    const { showModal, modalContent, pictures, status, error } = this.state;
    return (
      <div className="container">
        <Searchbar onSubmit={this.handleSearchSubmit} />
        <ImageGallery
          pictures={pictures}
          status={status}
          error={error}
          onClick={this.handleImageClick}
          onLoadMore={this.handleLoadMore}
        />
        <ToastContainer autoClose={3000} />
        {showModal &&
          createPortal(
            <Modal
              src={modalContent.url}
              alt={modalContent.alt}
              onClose={this.toggleModal}
            />,
            modalRoot
          )}
      </div>
    );
  }
}
