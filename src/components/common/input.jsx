import React, { Component } from "react";

const Input = (props) => {
  return (
    <div className="mb-3">
      <label id={props.name} htmlFor={props.name} className="form-label">
        {props.label}
      </label>
      {
        // input type is set as input name prop so that the target in ./loginForm.jsx
        // handleChange() function has a valid HTML input element type and therefor has a value
      }
      <input
        name={props.name}
        type={props.name}
        value={props.value}
        onChange={props.onChange}
        id={props.name}
        className="form-control"
        aria-describedby="emailHelp"
      />
      {
        // only render this error alert if error is defined
        props.error && <div className="alert alert-danger">{props.error}</div>
      }
    </div>
  );
};

export default Input;
