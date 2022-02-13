import React from "react";

const Formula = props => (
    <form onSubmit={props.weatherMethod}>
                <input type="text" name="city" placeholder="city" />
                <button>Get Weather </button>
    </form>
);
export default Formula;