import React from "react";
import { Link } from "react-router-dom";

const GenreEdit = ({ genre }) => {
  return (
    <React.Fragment>
      <Link
        to={`/genres/${genre._id}`}
        state={{
          _id: genre._id,
          name: genre.name,
        }}
      >
        <i className="bi-pencil h2 text-dark hoverLink"></i>
      </Link>
    </React.Fragment>
  );
};

export default GenreEdit;
