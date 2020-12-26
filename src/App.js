// Styles
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

// Global components
import { useState } from "react";
import { ToastContainer } from "react-toastify";

// Local components
import Searchbar from "./components/Searchbar";
import ImageGallery from "./components/ImageGallery";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const handleSearchSubmit = (searchQuery) => {
    setQuery(searchQuery);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="container">
      <Searchbar onSubmit={handleSearchSubmit} />
      <ImageGallery onLoadMore={handleLoadMore} query={query} page={page} />
      <ToastContainer autoClose={3000} />
    </div>
  );
}
