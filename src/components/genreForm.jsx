import React from "react";
import Form from "./common/form";
import HorizontalDivider from "./common/horizontalDivider";
import httpService from "../services/httpservice";
import config from "../config.json";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
const Joi = require("joi-browser");
const ObjectId = require("bson-objectid");

// login form extends form to get all its methods
class GenreForm extends Form {
  // initialize email and password fields to be empy and to have no errors
  state = {
    data: this.props.placeholders
      ? { name: this.props.placeholders.name }
      : {
          name: "",
        },
    errors: {},
    navigate: false,
  };

  schema = {
    name: Joi.string().required().label("Name"),
  };

  componentDidMount() {
    if (this.props.placeholders) {
      const { placeholders } = this.props;
      this.setState({ data: placeholders });
    }
  }

  // form.jsx component requires the submit function to be called doSubmit
  doSubmit = async () => {
    const data = { ...this.state.data };
    if (!this.props.placeholders) {
      const genre = {
        _id: ObjectId(),
        name: data.name,
      };
      try {
        const copy = { ...genre };
        copy._id = copy._id.toString();
        this.props.addGenre(copy);
        const response = await httpService.post(
          `${config.apiEndpoint}/genres`,
          genre
        );
        if (response.status === 200)
          toast.success(`Created New Genre ${genre.name}!`);
        else {
          this.props.removeGenre();
          toast.error("An Error Occurred. Please Try Again Later.");
        }
      } catch (exception) {
        this.props.removeGenre();
        toast.error("An Error Occurred. Please Try Again Later.");
      }
    } else {
      const genre = {
        _id: this.props.placeholders._id,
        name: data.name,
      };
      try {
        const response = await httpService.put(
          `${config.apiEndpoint}/genres/${this.props.placeholders._id}`,
          genre
        );
        if (response.status === 200)
          toast.success(`Successfully Updated ${genre.name}!`);
        else toast.error("An Error Occurred. Please Try Again Later.");
        this.setState({ navigate: true });
      } catch (exception) {
        toast.error("An Error Occurred. Please Try Again Later.");
      }
    }
  };

  render() {
    return (
      <div classtype="container">
        {this.state.navigate ? <Navigate to="/genres" /> : console.log("")}
        {
          // Submission handler
        }
        <form onSubmit={this.handleSubmit}>
          {
            // inputs
          }
          {this.renderInput("name", "Name", "text")}
          <HorizontalDivider />
          <div className="text-center">
            {
              // renderButton is also part of "this" now
              this.renderButton("Submit", "btn btn-success")
            }
            <Link to="/genres">
              <button
                type="button"
                className="btn btn-danger ms-2"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

export default GenreForm;
