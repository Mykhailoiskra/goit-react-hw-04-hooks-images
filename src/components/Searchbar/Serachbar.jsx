import "./SearchbarStyles.css";
import { Component } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

export default class SearchBar extends Component {
  state = {
    input: "",
  };

  handleNameChange = (event) => {
    this.setState({ input: event.currentTarget.value.toLowerCase() });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.input.trim() === "") {
      toast.warn("You have to type something!");
      return;
    }
    this.props.onSubmit(this.state.input);
    this.setState({ input: "" });
  };

  render() {
    return (
      <header className="Searchbar">
        <form className="SearchForm" onSubmit={this.handleSubmit}>
          <button type="submit" className="SearchForm-button">
            <span className="SearchForm-button-label">Search</span>
          </button>

          <input
            className="SearchForm-input"
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            value={this.state.input}
            onChange={this.handleNameChange}
          />
        </form>
      </header>
    );
  }
}

SearchBar.propTypes = { onSubmit: PropTypes.func };
