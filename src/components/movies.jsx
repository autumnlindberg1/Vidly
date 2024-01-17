import React, { Component } from "react";
import { getMovies } from "../services/movieService";
import { getGenres } from "../services/genreService";
import httpService from "../services/httpservice";
import config from "../config.json";
import Footer from "./footer";
import Pagination from "./pagination";
import { paginate } from "../utils/paginate";
import ListGroup from "./listGroup";
import { generateGenre } from "../utils/generateGenre";
import MovieTable from "./movieTable";
import MovieForm from "./movieForm";
import { toast } from "react-toastify";
import _ from "lodash";
import { filterMovies } from "../utils/filterMovies";
import UserContext from "../UserContext";
import { Navigate } from "react-router-dom";

// this component is the main component on the page, called in app.js (app.js is then called in index.js)

class Movies extends Component {
  static contextType = UserContext;
  state = {
    movies: [],
    filtered: [],
    pageSize: 4,
    currentPage: 1,
    genres: [],
    currentGenre: "All Movies",
    sortColumn: { path: "", order: "asc" },
  };

  // handler for the delete button
  handleDelete = async (movie) => {
    this.removeMovie();

    // post data
    try {
      const response = await httpService.delete(
        `${config.apiEndpoint}/movies/${movie._id}`
      );
      if (response.status === 200)
        toast.success(`Successfully Deleted ${movie.title}!`);
      else {
        this.addMovie(movie);
        toast.error("An Error Occurred. Please Try Again Later.");
      }
    } catch (exception) {
      this.addMovie(movie);
      toast.error("An Error Occurred. Please Try Again Later.");
    }
  };

  // handler for the like button
  handleLike = async (movie) => {
    // copy entire movies array from state (destructure into an array of objects using spread operator)
    const movies = [...this.state.movies];
    // indexOf returns first occurrence of given param (a movie in this case)
    const index = movies.indexOf(movie);
    // copy movie at found index into local movies array
    movies[index] = { ...movies[index] };
    // change to the opposite of whait is now
    movies[index].liked = !movies[index].liked;
    // update state
    this.setState({ movies: movies });

    // grab search content and filter
    const text = document.querySelector(".movieSearch").value;
    const filtered = filterMovies(movies, text);
    this.setState({ filtered: filtered });

    // make a put request and update data
    try {
      const response = await httpService.put(
        `${config.apiEndpoint}/movies/${movie._id}`,
        movies[index]
      );
      if (response.status === 200)
        toast.success(`Successfully Liked ${movies[index].title}!`);
      else toast.error("An Error Occurred. Please Try Again Later.");
    } catch (exception) {
      toast.error("An Error Occurred. Please Try Again Later.");
    }
  };

  // handler for the pagination
  handlePageChange = (pageNumber) => {
    // update state to reflect current page selected (default is 1)
    this.setState({ currentPage: pageNumber });
  };

  // handler for the genre selection
  handleGenreChange = (genreName) => {
    // update state to reflect current genre selected (default is all)
    this.setState({ currentGenre: genreName });
    const pageData = this.getPageData();
    if (
      pageData.numberOfMovies <=
      this.state.currentPage * this.state.pageSize
    ) {
      this.setState({ currentPage: 1 });
    }
  };

  // handler for sorting
  onSort = (sortColumn) => {
    // update state to reflect current column to be sorted (default is none)
    this.setState({ sortColumn: sortColumn });
  };

  // get initial data into state, style title
  async componentDidMount() {
    const listGroup = document.querySelector(".listGroup");
    const addButton = document.querySelector(".addButton");
    // offsetWidth returns the width of a given element as an integer
    let listGroupWidth = listGroup.offsetWidth;
    listGroupWidth -= listGroupWidth * 0.1;
    const style = listGroupWidth + "px";
    // adjust style to move title and subtitle
    addButton.style.width = style;

    // set initial data
    const { data: movies } = await getMovies();
    const { data: genres } = await getGenres();
    this.setState({ movies: movies, genres: genres, filtered: movies });
  }

  handleSearch = (e) => {
    // search customers here
    const searchText = e.currentTarget.value;
    // duplicate state
    const movies = this.state.movies;
    const filtered = filterMovies(movies, searchText);
    this.setState({ filtered: filtered });
    // check page number
    const pageData = this.getPageData();
    if (
      pageData.numberOfMovies <=
      this.state.currentPage * this.state.pageSize
    ) {
      this.setState({ currentPage: 1 });
    }
  };

  // function to show only the information for the current page of items AND current genre
  getPageData = () => {
    // grab current pagination information from state
    const { pageSize, currentPage, sortColumn } = this.state;
    // only display movies from specified genre (default is set to all)
    let filtered = generateGenre(this.state.filtered, this.state.currentGenre);
    // destructure movies array to take its length, naming it numberOfMovies
    // length is a property of EVERY array in JS
    const { length: numberOfMovies } = filtered;

    // order data using lodash
    // params are original array, propName of column being sorted, order by
    filtered = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    // paginate data
    filtered = paginate(filtered, currentPage, pageSize);
    //
    return { filtered, numberOfMovies };
  };

  addMovie = (movie) => {
    const movies = [...this.state.movies];
    movies.push(movie);
    this.setState({ movies: movies });
    // grab search content and filter
    const text = document.querySelector(".movieSearch").value;
    const filtered = filterMovies(movies, text);
    this.setState({ filtered: filtered });
  };

  removeMovie = () => {
    const movies = [...this.state.movies];
    movies.pop();
    this.setState({ movies: movies });
    // grab search content and filter
    const text = document.querySelector(".movieSearch").value;
    const filtered = filterMovies(movies, text);
    this.setState({ filtered: filtered });
  };

  render() {
    let message = "";
    // get data for sorting from state
    const { pageSize, currentPage } = this.state;
    // get page data, moviesObj stores movies and length of array
    const moviesObj = this.getPageData();
    // extract returned values from moviesObj so variables can be used
    const { filtered, numberOfMovies } = moviesObj;

    if (numberOfMovies === 0) {
      message = "No movies found";
    } else {
      message = numberOfMovies + " movies found";
    }
    return (
      <>
        <div className="page-container">
          {!localStorage.getItem("token") ? (
            <Navigate to="/login" />
          ) : (
            console.log("")
          )}
          <div className="titleAndButton d-flex justify-content-start align-items-top">
            <div className="addButtonModal">
              <button
                type="button"
                className="btn btn-primary addButton p-4 me-4 mt-2"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                <div className="mb-0">[+] New Movie</div>
              </button>

              <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">
                        New Movie
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <MovieForm
                        addMovie={this.addMovie}
                        removeMovie={this.removeMovie}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="ms-2 d-flex justify-content-start flex-grow-1">
              <div className="title ms-3">
                <h1>Movies List</h1>
                <h3>{message}</h3>
              </div>
              <form className="d-flex ms-5 navSearchBar">
                <input
                  className="form-control m-3 border border-dark input-lg movieSearch"
                  type="search"
                  placeholder="Search Movies"
                  aria-label="Search"
                  onChange={this.handleSearch}
                />
              </form>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-2 listGroup">
              <ListGroup
                genres={this.state.genres}
                currentGenre={this.state.currentGenre}
                onGenreChange={this.handleGenreChange}
              />
            </div>
            <div className="col ms-4">
              <div className="movieTable">
                <MovieTable
                  movies={filtered}
                  onSort={this.onSort}
                  sortColumn={this.state.sortColumn}
                  onDelete={this.handleDelete}
                  onLike={this.handleLike}
                />
                <div className="mt-4">
                  <Pagination
                    numberOfMovies={numberOfMovies}
                    onPageChange={this.handlePageChange}
                    pageSize={pageSize}
                    currentPage={currentPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

export default Movies;
