import React from "react";
import { useLocation } from "react-router-dom";
import MovieList from "./movieList";
import httpService from "../services/httpservice";
import config from "../config.json";
import { toast } from "react-toastify";
import Footer from "./footer";
const ObjectId = require("bson-objectid");

const NewRental = () => {
  //const routeParams = useParams();
  const location = useLocation();

  const handleSelect = async (movie) => {
    // create a rental object to pass to endpoint
    const rental = {
      _id: ObjectId(),
      customer: {
        _id: location.state._id,
        name: location.state.name,
        dateJoined: location.state.dateJoined,
        phone: location.state.phone,
        email: location.state.email,
        isGold: location.state.isGold,
        points: location.state.points,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        genre: movie.genre,
        numberInStock: movie.numberInStock,
        dailyRentalRate: movie.dailyRentalRate,
        publishDate: movie.publishDate,
        liked: movie.liked,
      },
    };

    // send request
    try {
      const response = await httpService.post(
        `${config.apiEndpoint}/rentals`,
        rental
      );
      if (response.status === 200)
        toast.success(
          `Successfully Rented ${rental.customer.name} to ${rental.movie.title}!`
        );
      else toast.error("An Error Occurred. Please Try Again Later");
    } catch (exception) {
      toast.error("An Error Occurred. Please Try Again Later");
    }
  };

  return (
    <React.Fragment>
      <div className="page-container">
        <h1>Rent a Movie to {location.state.name}</h1>
        <MovieList movies={location.state.movies} onSelect={handleSelect} />
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default NewRental;
